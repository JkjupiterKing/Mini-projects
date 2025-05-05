document.addEventListener("DOMContentLoaded", () => {
  $("#mySidenav").load("../../app/sidebar/sidebar.html");

  function fetchDataAndUpdateUI() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/projects/all");
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var responseData = JSON.parse(xhr.responseText);

          // Update project count boxes
          updateProjectCounts(responseData);

          // Update charts
          updateCharts(responseData);

          // Update status pie chart
          updateStatusPieChart(responseData);
        } catch (error) {
          console.error("Error parsing JSON response:", error);
        }
      } else {
        console.error("Error fetching project data:", xhr.statusText);
      }
    };
    xhr.onerror = function () {
      console.error("Request failed");
    };
    xhr.send();
  }

  // Function to update project count boxes
  function updateProjectCounts(projects) {
    var upcomingProjectsCount = 0;
    var ongoingProjectsCount = 0;
    var completedProjectsCount = 0;

    // Count projects based on status
    projects.forEach(function (project) {
      switch (project.status) {
        case "Upcoming":
          upcomingProjectsCount++;
          break;
        case "Ongoing":
          ongoingProjectsCount++;
          break;
        case "Completed":
          completedProjectsCount++;
          break;
      }
    });

    // Update count boxes
    updateProjectCount("Upcoming Projects", upcomingProjectsCount);
    updateProjectCount("Ongoing Projects", ongoingProjectsCount);
    updateProjectCount("Completed Projects", completedProjectsCount);
  }

  // Function to update the count in the UI
  function updateProjectCount(category, count) {
    var box = document.querySelector(".box." + getCategoryClass(category));
    if (box) {
      var numberSpan = box.querySelector(".number");
      if (numberSpan) {
        numberSpan.textContent = count;
      }
    }
  }

  // Helper function to get class name based on category
  function getCategoryClass(category) {
    switch (category) {
      case "Upcoming Projects":
        return "box1";
      case "Ongoing Projects":
        return "box2";
      case "Completed Projects":
        return "box3";
      default:
        return "";
    }
  }

  // Function to update chart data
  function updateChartData(chart, labels, data, bgColor, borderColor) {
    chart.data.labels = labels;
    chart.data.datasets.forEach(function (dataset) {
      dataset.data = data;
      dataset.backgroundColor = bgColor;
      dataset.borderColor = borderColor;
    });
    chart.update();
  }

  // Function to update the charts (bar chart for statuses, pie chart for project status distribution)
  function updateCharts(projects) {
    // Separate projects based on their status
    const statusCounts = {
      Planned: 0,
      "In-Progress": 0,
      Completed: 0,
      Pending: 0,
      Upcoming: 0,
      Ongoing: 0,
    };

    projects.forEach((project) => {
      if (statusCounts.hasOwnProperty(project.status)) {
        statusCounts[project.status]++;
      }
    });

    const statusLabels = Object.keys(statusCounts);
    const statusData = Object.values(statusCounts);

    // Update bar chart (projectStatusChart)
    updateChartData(
      projectStatusChart,
      statusLabels,
      statusData,
      "rgba(153, 102, 255, 0.2)",
      "rgba(153, 102, 255, 1)"
    );
  }

  // Initialize Charts
  const ctx1 = document.getElementById("projectStatusChart").getContext("2d");

  const projectStatusChart = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: [], // Empty labels initially
      datasets: [
        {
          label: "Project Status",
          data: [], // Empty data initially
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1, // Ensure integer steps on y-axis
          },
          title: {
            display: true,
            text: "Number of Projects",
            color: "#000000",
            font: {
              size: 14,
            },
          },
        },
        x: {
          title: {
            display: true,
            text: "Project Status",
            color: "#000000",
            font: {
              size: 14,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.label + ": " + context.raw + " projects";
            },
          },
        },
      },
    },
  });

  // Fetch and update data initially
  fetchDataAndUpdateUI();
});
