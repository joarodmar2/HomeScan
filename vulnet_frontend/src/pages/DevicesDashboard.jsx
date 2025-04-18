import { useEffect, useState } from "react";
import { getNdevNvuln, getAllDevices, getNSeveritySummaryList, getNSeveritySummary, getWeightedAverage, getAverageSustainability } from "../api/devices.api";
import BubbleChart from './react-bubble-chart-d3';
import ReactApexChart from 'react-apexcharts';

export function DevicesDashboard() {
  const [devices, setDevices] = useState([]);
  const [devices_list, setDeviceModel] = useState([]);
  const [vuln_list, setVuln] = useState([]);
  const [ndevnvuln, setNdevNvuln] = useState([]);
  const [nvuln, setNvulns] = useState([]);
  const [ndev, setNdev] = useState([]);
  const [severity_summary_list, setNSeveritySummaryList] = useState([]);
  const [severity_summary, setNSeveritySummary] = useState([]);
  const [weighted_average, setWeightedAverage] = useState([]);
  const [average_sustainability, setAverageSustainability] = useState([]);
  const [estanciaVulnerabilidades, setEstanciaVulnerabilidades] = useState([]);

  const low_per = Math.round(severity_summary["low"] / severity_summary["total"] * 100);

  useEffect(() => { //  Cargar los dispositivos
    async function loadDevices() {
      const res = await getAllDevices();
      setDevices(res.data);
      const values = res.data.map(device => device.model);
      setDeviceModel(values);
      const vulns = res.data.map(device => device.vulnerabilities);
      setVuln(vulns);
    }
    loadDevices();
  }, []);

  useEffect(() => { //cargar promedio ponderado
    async function loadWeightedAverage() {
      const res = await getWeightedAverage();
      setWeightedAverage(res.data);
    }
    loadWeightedAverage();
  }, []);

  useEffect(() => { //Cargar la sostenibilidad promedio
    async function loadAverageSustainability() {
      const res = await getAverageSustainability();
      setAverageSustainability(res.data["AverageSustainability"]);
    }
    loadAverageSustainability();
  }, []);

  useEffect(() => { //cargar el número de dispositivos y vulnerabilidades
    async function loadNDevicesNvuln() {
      const res = await getNdevNvuln();
      setNdevNvuln(res.data);
      setNvulns(res.data["nvuln"]);
      setNdev(res.data["ndev"]);
    }
    loadNDevicesNvuln();
  }, []);

  useEffect(() => {//Cargar la lista de resúmenes de severidad
    async function loadNSeveritySummaryList() {
      const res = await getNSeveritySummaryList();
      setNSeveritySummaryList(res.data);
    }
    loadNSeveritySummaryList();
  }, []);

  useEffect(() => { //Cargar el resumen de severidad
    async function loadNSeveritySummary() {
      const res = await getNSeveritySummary();
      setNSeveritySummary(res.data);
    }
    loadNSeveritySummary();
  }, []);

  useEffect(() => {
    async function loadEstanciasVulnerabilidades() {
      try {
        const res = await fetch("http://localhost:8000/vulnet/api/v1/vulnerabilidades-por-estancia/");
        const data = await res.json();
        setEstanciaVulnerabilidades(data);
      } catch (error) {
        console.error("Error al cargar vulnerabilidades por estancia:", error);
      }
    }
    loadEstanciasVulnerabilidades();
  }, []);



  const bubbleClick = (label) => {
    console.log("Custom bubble click func")
  }

  const legendClick = (label) => {
    console.log("Customer legend click func")
  }

  const data_array = estanciaVulnerabilidades.map(estancia => {
    const size = estancia.total_vulnerabilidades;
    return {
      label: estancia.estancia,
      value: size,
      size: size * 10,
      color: getRandomColor()
    };
  });

  const totalEstancias = estanciaVulnerabilidades.length;

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  // Ahora definimos el objeto data correctamente
  const data = {
    series: [{
      name: 'NONE',
      data: severity_summary_list["none"] || [0] // Asegúrate de que no sea NaN
    }, {
      name: 'LOW',
      data: severity_summary_list["low"] || [0] // Asegúrate de que no sea NaN
    }, {
      name: 'MEDIUM',
      data: severity_summary_list["medium"] || [0] // Asegúrate de que no sea NaN
    }, {
      name: 'HIGH',
      data: severity_summary_list["high"] || [0] // Asegúrate de que no sea NaN
    }, {
      name: 'CRITICAL',
      data: severity_summary_list["critical"] || [0] // Asegúrate de que no sea NaN
    }],
    options: {
      chart: {
        background: '#202020',
        foreColor: '#fff',
        type: 'bar',
        height: 350,
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: '13px',
                fontWeight: 900,
                color: "#fff"
              }
            }
          }
        },
      },
      stroke: {
        width: 1,
        colors: ['#000']
      },
      title: {
        text: 'Vulnerabilities Severity'
      },
      xaxis: {
        categories: devices_list,
        labels: {
          formatter: function (val) {
            return val
          }
        }
      },
      yaxis: {
        title: {
          text: undefined
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40
      },
      theme: {
        mode: 'dark',
        palette: 'palette1',
      }
    }
  };

  return (
    <>
      <div className="chart-row">
        <div className="chart-container-wrapper">
          <div className="chart-container">
            <div className="chart-info-wrapper">
              <h2> Dispositivos</h2>
              <span>{ndev}</span>
            </div>
          </div>
        </div>
        <div className="chart-container-wrapper">
          <div className="chart-container-2">
            <div className="chart-info-wrapper">
              <h2>Dispositivos Vulnerables</h2>
              <span>{nvuln}</span>
            </div>
          </div>
        </div>
        <div className="chart-container-wrapper">
          <div className="chart-container-3">
            <div className="chart-info-wrapper">
              <h2>Total Vulnerabilidades</h2>
              <span>{severity_summary["total"]}</span>
            </div>
          </div>
        </div>
        <div className="chart-container-wrapper">
          <div className="chart-container-4">
            <div className="chart-info-wrapper">
              <h2>Average</h2>
              <span>{Math.round(weighted_average.WeightedAverage * 100) / 100}</span>
            </div>
          </div>
        </div>
        <div className="chart-container-wrapper">
          <div className="chart-container-5">
            <div className="chart-info-wrapper">
              <h2>Total de estancias: </h2>
              <span>{totalEstancias}</span>
            </div>
          </div>
        </div>

      </div>

      <div className="chart">
        <ReactApexChart options={data.options} series={data.series} type="bar" height={500} width={1000} />
      </div>
      <div className="estancia-vuln-list text-white p-4">
        <h2 className="text-xl font-bold mb-2">Vulnerabilidades por estancia</h2>
        <ul>
          {estanciaVulnerabilidades.map((item, index) => (
            <li key={index}>
              <strong>{item.estancia}</strong>: {item.total_vulnerabilidades} vulnerabilidades
            </li>
          ))}
        </ul>
      </div>

      <BubbleChart
        graph={{
          zoom: 1,
          offsetX: 0.00,
          offsetY: 0.00
        }}
        width={570}
        height={570}
        padding={0}
        showLegend={false}
        valueFont={{
          family: 'Arial',
          size: 12,
          color: '#fff',
          weight: 'bold',
        }}
        labelFont={{
          family: 'Arial',
          size: 16,
          color: '#fff',
          weight: 'bold',
        }}
        bubbleClickFunc={bubbleClick}
        legendClickFun={legendClick}
        data={data_array} />
    </>
  );
}
