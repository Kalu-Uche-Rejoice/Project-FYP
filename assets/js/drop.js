function generate_year_range(start, end) {
    var years = "";
    for (var year = start; year <= end; year++) {
        years += "<option value='" + year + "'>" + year + "</option>";
    }
    return years;
  }
  let today = new Date();
  let currentYear = today.getFullYear();
  let selectYear = document.getElementById("Year");
  let createYear = generate_year_range( 2022, currentYear );
  selectYear.innerHTML = createYear;