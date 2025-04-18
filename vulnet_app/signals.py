
from django.db.models.signals import post_save
from django.dispatch import receiver
from vulnet_app.models import Device, Vulnerability
from vulnet_app.vuln_collectors import search_all_vulns

def clean_value(v):
    return None if v in ["N/A", "", None] else v

@receiver(post_save, sender=Device)
def scan(sender, instance, created, **kwargs):
    if created:
        print(f"🛰️ Escaneando vulnerabilidades para modelo: {instance.model}")
        vulns = search_all_vulns(instance.model)

        print(f"📋 Vulnerabilidades encontradas: {len(vulns)}")
        for vul in vulns:
            if vul["source"] != "NVD":
                continue  # ⛔ Saltamos las que no son de NVD
            print(f"➡️ {vul['source']} | {vul['id']}")
            print("🧪 Datos que se van a guardar:")
            for k, v in vul.items():
                print(f"  {k}: {v}")

            # Si el vector existe y no es 'N/A', calcula versión, CVSS, exploitability e impact
            if vul["vector"] and vul["vector"] != "N/A":
                vector = vul["vector"]
                vector_lst = vector.split(":")
                vector_values = []
                version = 3

                if vector.startswith("CVSS:3"):
                    # CVSS v3.x
                    av = vector_lst[2][0]
                    vector_values.append(0.85 if av == "N" else 0.62 if av == "A" else 0.55 if av == "L" else 0.2)

                    ac = vector_lst[3][0]
                    vector_values.append(0.77 if ac == "L" else 0.44)

                    pr = vector_lst[4][0]
                    s = vector_lst[6][0]
                    if pr == "N":
                        vector_values.append(0.85)
                    elif pr == "L":
                        vector_values.append(0.68 if s == "C" else 0.62)
                    else:
                        vector_values.append(0.50 if s == "C" else 0.27)

                    ui = vector_lst[5][0]
                    vector_values.append(0.85 if ui == "N" else 0.62)

                    c = vector_lst[7][0]
                    vector_values.append(0 if c == "N" else 0.22 if c == "L" else 0.56)

                    i = vector_lst[8][0]
                    vector_values.append(0 if i == "N" else 0.22 if i == "L" else 0.56)

                    a = vector_lst[9][0]
                    vector_values.append(0 if a == "N" else 0.22 if a == "L" else 0.56)

                else:
                    # CVSS v2.0
                    version = 2
                    vector_lst = vector.split("/")
                    av = vector_lst[0].split(":")[-1][0]
                    vector_values.append(1 if av == "N" else 0.646 if av == "A" else 0.395)

                    ac = vector_lst[1].split(":")[-1][0]
                    vector_values.append(0.71 if ac == "L" else 0.61 if ac == "M" else 0.35)

                    au = vector_lst[2].split(":")[-1][0]
                    vector_values.append(0.704 if au == "N" else 0.56 if au == "S" else 0.45)

                    c = vector_lst[3].split(":")[-1][0]
                    vector_values.append(0 if c == "N" else 0.275 if c == "P" else 0.660)

                    i = vector_lst[4].split(":")[-1][0]
                    vector_values.append(0 if i == "N" else 0.275 if i == "P" else 0.660)

                    a = vector_lst[5].split(":")[-1][0]
                    vector_values.append(0 if a == "N" else 0.275 if a == "P" else 0.660)

                # Cálculo final
                vul["version"] = version
                vul["cvss"] = round(sum(vector_values[:4]), 1)
                vul["exploitability"] = round(sum(vector_values[:3]), 1)
                vul["impact"] = round(sum(vector_values[3:]), 1)
            else:
                vul["version"] = 0.0
                vul["cvss"] = 0.0
                vul["exploitability"] = 0.0
                vul["impact"] = 0.0

            # Limpieza de valores tipo texto
            for campo in ["cwe", "vector", "baseSeverity"]:
                if vul.get(campo) in ["N/A", "", None]:
                    vul[campo] = None

            # Conversión de numéricos
            for campo in ["cvss", "version", "exploitability", "impact"]:
                try:
                    vul[campo] = float(vul[campo])
                except (ValueError, TypeError):
                    vul[campo] = 0.0

            # Guardar en la base de datos
            Vulnerability.objects.create(
                name=vul["id"],
                description=vul["description"],
                baseSeverity=vul["baseSeverity"],
                version=vul["version"],
                cvss=vul["cvss"],
                exploitability=vul["exploitability"],
                impact=vul["impact"],
                cwe=vul["cwe"],
                vector=vul["vector"],
                device=instance,
                source=vul["source"],
            )

        print("✅ Vulnerabilidades guardadas con éxito.")
