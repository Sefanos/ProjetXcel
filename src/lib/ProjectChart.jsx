import Chart from 'chart.js/auto';
import { useEffect, useRef, useState } from 'react';
import { fetchProjects } from './Overdue';

const ProjectChart = () => {
  const chartRef = useRef();
  const [transformedProjects, setTransformedProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects
        const projectsData = await fetchProjects();

        // Ensure projectsData is an array before mapping
        const projectsArray = Array.isArray(projectsData) ? projectsData : [];

        // Transform projects data
        const transformedProjectsData = projectsArray.map(project => ({
          titre: project.titre,
          status: project.status
        }));

        // Set transformed projects to state
        setTransformedProjects(transformedProjectsData);

        // Use transformedProjectsData as needed
        console.log(transformedProjectsData);
      } catch (error) {
        console.error('Error fetching or transforming data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef && chartRef.current && transformedProjects.length > 0) {
      const ctx = chartRef.current.getContext('2d');

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: transformedProjects.map((project) => project.titre),
          datasets: [{
            label: 'Project Completion (%)',
            data: transformedProjects.map((project) => project.status),
            backgroundColor: 'rgba(54, 162, 235, 0.5)', 
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          }],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Completion (%)',
              },
            },
          },
        },
      });
    }
  }, [transformedProjects]);

  return (
    <div>
      <canvas ref={chartRef} width="400" height="400" />
    </div>
  );
};

export default ProjectChart;
