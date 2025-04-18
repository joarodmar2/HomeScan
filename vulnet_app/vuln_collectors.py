# vuln_collectors.py
import requests
import json
from bs4 import BeautifulSoup
import pandas as pd

# -------------------- NVD (NIST) --------------------
def search_nvd_vulns(model):
    model_url = model.replace(" ", "%20")
    vulns = []

    try:
        response = requests.get(f'https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch={model_url}')
        json_object = response.json()
        json_vulns = json_object.get("vulnerabilities", [])

        for item in json_vulns:
            cve = item["cve"]
            metrics = cve.get("metrics", {})
            id = cve.get("id", "N/A")
            description = cve["descriptions"][0]["value"]
            weaknesses = cve.get("weaknesses", [])
            cwe = weaknesses[0]["description"][0]["value"] if weaknesses else "N/A"

            def extract(metric_key):
                data = metrics.get(metric_key, [{}])[0]
                return {
                    "id": id,
                    "description": description,
                    "version": data["cvssData"].get("version", "N/A"),
                    "cvss": data["cvssData"].get("baseScore", 0.0),
                    "severity": data["cvssData"].get("baseScore", 0.0),
                    "exploitability": data.get("exploitabilityScore", "N/A"),
                    "impact": data.get("impactScore", "N/A"),
                    "cwe": cwe,
                    "vector": data["cvssData"]["vectorString"],
                    "source": "NVD"
                }

            for metric_key in ["cvssMetricV31", "cvssMetricV30", "cvssMetricV2"]:
                if metric_key in metrics:
                    vulns.append(extract(metric_key))
                    break
    except Exception as e:
        print("Error buscando en NVD:", e)

    return vulns


# -------------------- NOTCVE --------------------
def search_notcve_vulns(keyword):
    import requests
    from bs4 import BeautifulSoup

    print(f"🌐 Buscando en NOTCVE por: '{keyword}'")
    url = f"https://notcve.org/search.php?query={keyword.replace(' ', '+')}"
    headers = {"User-Agent": "Mozilla/5.0"}
    vulns = []

    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"❌ Error al acceder: {response.status_code}")
            return []

        soup = BeautifulSoup(response.text, "lxml")
        entries = soup.find_all("div", class_="panel-body")
        print(f"🔢 Resultados encontrados: {len(entries)}")

        for entry in entries:
            title_tag = entry.find("h2", class_="result-link")
            link_tag = entry.find("p", class_="green-link")
            description_tag = entry.find_all("p")[-1]  # último <p> es la descripción

            vuln_id = title_tag.get_text(strip=True) if title_tag else "N/A"
            description = description_tag.get_text(strip=True) if description_tag else "Sin descripción"
            link = link_tag.get_text(strip=True) if link_tag else "https://notcve.org"

            vulns.append({
                "id": vuln_id,
                "description": description,
                "version": "N/A",
                "cvss": "N/A",
                "severity": "N/A",
                "exploitability": "N/A",
                "impact": "N/A",
                "cwe": "N/A",
                "vector": "N/A",
                "source": "NOTCVE",
                "link": link
            })

    except Exception as e:
        print("❗ Error durante scraping NOTCVE:", e)

    return vulns







# -------------------- Combinador --------------------
def search_all_vulns(model):
    return search_nvd_vulns(model) + search_notcve_vulns(model)
