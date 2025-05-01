// Load the sidenav
$('#mySidenav').load('../../app/user-Sidenav/sidenav.html');

const currentUser = JSON.parse(localStorage.getItem('User'));

document.addEventListener('DOMContentLoaded', function () {
    if (currentUser && currentUser.employeeId) {
        fetchCompletedCourses(currentUser.employeeId);
    } else {
        console.error('No current user found or employee ID missing in localStorage.');
    }
});

function fetchCompletedCourses(employeeId) {
    const apiUrl = `http://localhost:8080/enrollments/status?employeeId=${employeeId}&status=Completed`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(enrollments => {
            console.log('Completed Enrollments:', enrollments);
            if (enrollments.length === 0) {
                displayNoEnrolledCoursesMessage();
            } else {
                const courseDetails = enrollments.map(enrollment => ({
                    courseId: enrollment.course.courseId,
                    enrollmentId: enrollment.enrollmentId,
                    courseName: enrollment.course.courseName
                }));
                fetchCoursesByEnrollments(courseDetails);
            }
        })
        .catch(error => {
            console.error('Error fetching completed courses:', error);
        });
}

function fetchCoursesByEnrollments(courseDetails) {
    if (courseDetails.length === 0) {
        console.log('No completed courses found for the employee.');
        displayNoEnrolledCoursesMessage();
        return;
    }

    Promise.all(courseDetails.map(detail => fetchCourseById(detail.courseId)))
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(courses => {
            console.log('Courses:', courses);
            displayCourses(courses, courseDetails);
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
        });
}

function fetchCourseById(courseId) {
    const apiUrl = `http://localhost:8080/courses/${courseId}`;
    return fetch(apiUrl).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok for course ID ' + courseId);
        }
        return response;
    });
}

function displayCourses(courses, courseDetails) {
    const container = document.getElementById('assessmentList');
    container.innerHTML = ''; 

    if (courses.length === 0) {
        displayNoEnrolledCoursesMessage();
        return;
    }

    courses.forEach(course => {
        const courseDetail = courseDetails.find(detail => detail.courseId === course.courseId);
        if (!courseDetail) return; 

        const courseHtml = `
           <div class="col-md-6 mb-4">
            <div class="assessment-item card">
                <img src="${course.imageUrl}" class="card-img-top" alt="${course.courseName}">
                <div class="card-body">
                    <h5 class="card-title">${course.courseName}</h5>
                    <p class="card-text">${course.description}</p>
                    <a href="#" class="btn btn-primary start-assessment"
                       data-course-name="${course.courseName}" 
                       data-enrollment-id="${courseDetail.enrollmentId}">Start Assessment</a>
                    <button class="btn btn-secondary view-results"
                       data-enrollment-id="${courseDetail.enrollmentId}">View Results</button>
                </div>
            </div>
        </div>
        `;
        container.innerHTML += courseHtml;
    });

    document.querySelectorAll('.start-assessment').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); 
            const courseName = this.getAttribute('data-course-name');
            const enrollmentId = this.getAttribute('data-enrollment-id');
            checkAttemptLimit(enrollmentId, courseName);
            localStorage.setItem('currentCourseName', courseName);
            localStorage.setItem('currentEnrollmentId', enrollmentId);
        });
    });

    document.querySelectorAll('.view-results').forEach(button => {
        button.addEventListener('click', function() {
            const enrollmentId = this.getAttribute('data-enrollment-id');
            fetchAssessmentResults(enrollmentId, button);
        });
    });
}

function checkAttemptLimit(enrollmentId, courseName) {
    const apiUrl = `http://localhost:8080/assessment-results/getResults?enrollmentId=${enrollmentId}&employeeId=${currentUser.employeeId}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(results => {
            const maxAttempts = 3;
            const attempts = results.length;

            if (attempts >= maxAttempts) {
                alert('You have reached the maximum number of attempts for this assessment.');
            } else {
                localStorage.setItem('currentCourseName', courseName);
                localStorage.setItem('currentEnrollmentId', enrollmentId);
                window.open('../../app/Questions/question.html', '_blank');
            }
        })
        .catch(error => {
            console.error('Error fetching assessment results:', error);
            window.open('../../app/Questions/question.html', '_blank');
        });
}

function fetchAssessmentResults(enrollmentId, button) {
    const apiUrl = `http://localhost:8080/assessment-results/getResults?enrollmentId=${enrollmentId}&employeeId=${currentUser.employeeId}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(results => {
            if (results.length === 0) {
                // No results found, redirect to assessment page
                localStorage.setItem('currentEnrollmentId', enrollmentId);
                window.open('../../app/Questions/question.html', '_blank');
            } else {
                showResultsInModal(results);
            }
        })
        .catch(error => {
            console.error('Error fetching assessment results:', error);
        });
}

function showResultsInModal(results) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = ''; 

    let index = 0;
    results.forEach(result => {
        index++;
        const resultHtml = `
        <p><strong>Attempt:</strong> ${index}</p>
        <p><strong>Course:</strong> ${result.enrollment.course.courseName}</p>
        <p><strong>Score:</strong> ${result.score}</p>
            <hr>
        `;
        modalBody.innerHTML += resultHtml;
    });

    const myModal = new bootstrap.Modal(document.getElementById('resultsModal'));
    myModal.show();
}

function displayNoEnrolledCoursesMessage() {
    const container = $('#assessmentList');
    container.html('<p>No completed courses found.</p>');
}
