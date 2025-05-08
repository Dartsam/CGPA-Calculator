document.addEventListener('DOMContentLoaded', () => {
    let courseCount = 0;

    const form = document.getElementById('cgpaForm');
    const coursesDiv = document.getElementById('coursesContainer');
    const imgInput = document.getElementById('imageInput');
    const imgPreview = document.getElementById('imagePreview');
    const tableBody = document.querySelector('#courseTable tbody');
    const gradeSel = document.getElementById('gradingSystem');

    // Fix: correct reference for user details
    const displayFields = {
      name: document.querySelector('#coursesContainer span#name'),
      faculty: document.querySelector('#coursesContainer span#faculty'),
      department: document.querySelector('#coursesContainer span#department'),
      matric: document.querySelector('#coursesContainer span#matric'),
      level: document.querySelector('#coursesContainer span#level'),
      semester: document.querySelector('#coursesContainer span#semester'),
    };

    // Update displayed user details
    form.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', () => {
        const id = input.id.toLowerCase();
        if (displayFields[id]) {
          displayFields[id].textContent = input.value;
        }
      });
    });

    // 1. IMAGE PREVIEW
    imgInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        imgPreview.src = reader.result;
        imgPreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    });

    // 2. ADD A NEW COURSE ROW
    document.getElementById('addCourseBtn').addEventListener('click', () => {
      courseCount++;
      const row = document.createElement('div');
      row.className = 'row mb-2';
      row.innerHTML = `
      <div class="col-md-3">
        <input  name="code"  class="form-control" placeholder="Course Code">
      </div>
      <div class="col-md-3">
        <input name="title"  class="form-control" plaaceholder="Course Title">
      </div>
      <div class="col-md-3">
        <input name="unit"  type="number" class="form-control" placeholder="Unit">
      </div>
      <div class="col-md-3">
        <input name="score" type="number" class="form-control" placeholder="Score">
      </div>`;
      coursesDiv.appendChild(row);
    });

    // 3. CALCULATE & POPULATE TABLE ON SUBMIT
    form.addEventListener('submit', e => {
      e.preventDefault();
      const codes = form.querySelectorAll('[name=code]');
      const titles = form.querySelectorAll('[name=title]');
      const units = form.querySelectorAll('[name=unit]');
      const scores = form.querySelectorAll('[name=score]');
      const system = gradeSel.value;

      let totalPoints = 0, totalUnits = 0;
      tableBody.innerHTML = '';  // clear previous table rows

      codes.forEach((codeInput, i) => {
        const code = codeInput.value || '-';
        const title = titles[i].value || '-';
        const unit = parseFloat(units[i].value) || 0;
        const score = parseFloat(scores[i].value) || 0;
        const gp = getGradePoint(score, system);
        const lt = getGradeLetter(score, system);

        totalPoints += unit * gp;
        totalUnits += unit;

        // add row to summary table
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${i + 1}</td>
          <td>${code}</td>
          <td>${title}</td>
          <td>${unit}</td>
          <td>${score}</td>
          <td>${lt}</td>
          <td>${gp}</td>`;
        tableBody.appendChild(tr);
      });

      // show CGPA result
      const cgpa = totalUnits ? (totalPoints / totalUnits).toFixed(2) : '0.00';
      document.getElementById('result1').textContent = totalUnits + ' Units';
      document.getElementById('result2').textContent = 'CGPA: ' + cgpa;
      document.getElementById('result3').textContent = totalPoints + '  Points'
      document.getElementById('classResult').textContent  = getClass(parseFloat(cgpa));
    });

    // 4. GRADE POINT FUNCTION
    function getGradePoint(score, sys) {
      if (sys === '5') {
        if (score >= 70) return 5;
        if (score >= 60) return 4;
        if (score >= 50) return 3;
        if (score >= 45) return 2;
        if (score >= 40) return 1;
        return 0;
      } else {
        if (score >= 85) return 4;
        if (score >= 70) return 3.5;
        if (score >= 55) return 3;
        if (score >= 40) return 2;
        return 0;
      }
    }

    // 5. GRADE LETTER FUNCTION
    function getGradeLetter(score, sys) {
      if (sys === '5') {
        if (score >= 70) return 'A';
        if (score >= 60) return 'B';
        if (score >= 50) return 'C';
        if (score >= 45) return 'D';
        if (score >= 40) return 'E';
        return 'F';
      } else {
        if (score >= 85) return 'A';
        if (score >= 70) return 'B';
        if (score >= 55) return 'C';
        if (score >= 40) return 'D';
        return 'F';
      }
    }
  
  function getClass(cgpa, sys) {
      if (sys === '5') { 
          if (cgpa >= 4.50) return 'First Class';
          if (cgpa >= 3.50) return 'Second Class, Upper Division';
          if (cgpa >= 2.50) return 'Second Class, Lower Division';
          if (cgpa >= 1.50) return 'Third Class';
          return 'Fail'; // or 'Fail'
      } else { 
          if (cgpa >= 3.60) return 'First Class';
          if (cgpa >= 2.80) return 'Second Class, Upper Division';
          if (cgpa >= 2.00) return 'Second Class, Lower Division';
          if (cgpa >= 1.20) return 'Third Class';
          return 'Fail';
      }}
  });