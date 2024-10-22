import React from 'react';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

const LineChart = ({ labels, dataSet }) => {


  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );



  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },

    },
  };
  const data = {
    labels,
    datasets: [
      {
        label: 'Sales',
        data: dataSet,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  return (
    <Line options={options} data={data} height={50} />
  );
};

export default LineChart;