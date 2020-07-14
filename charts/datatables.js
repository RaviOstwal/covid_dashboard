var table = null;

function loadTable() {

  if (table) {
    return;
  }

  table = $('#allCountryDataTable').DataTable({
      data: countriesData,
      columns: columns,
      searching: false,
  });

  table.order([1, 'desc']).draw();

  table.on( 'order.dt', function (e, settings, order) {
    sortColumn = columns[order[0].col].data;
    isAscSort = order[0].dir === "asc";

    loadBarChart();
    onMapLoad();
  });

}