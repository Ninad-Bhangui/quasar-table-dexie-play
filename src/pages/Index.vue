<template>
  <q-page class="flex flex-center">
    <q-table
      title="Treats"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pagination"
      :loading="loading"
      :filter="filters"
      :filter-method="onRequest"
      @request="onRequest"
      binary-state-sort
    >
      <!--CUSTOM TABLE HEADER SLOT-->
      <template v-slot:header="props">
        <q-tr
          :props="props"
          class="bg-white"
        >
          <q-th
            :props="props"
            :key="col.name"
            v-for="col in props.cols"
            class="text-black"
          >
            <div class="row inline">
              <div class="column">
                <p>{{ col.label }}</p>
              </div>
              <div class="colum">

              </div>
            </div>
          </q-th>
        </q-tr>
        <q-tr
          :props="props"
          class="bg-white"
        >
          <q-th
            :key="col.name"
            v-for="col in props.cols"
            style="padding: 0px 0px 0px 0px;"
          >
            <q-input
              dense
              debounce="300"
              color="teal"
              class="q-pa-xs text-white"
              filled
              v-model="filters[col.name]"
            >
              <template
                v-if="filters[col.name]"
                v-slot:append
              >
                <q-icon
                  name="cancel"
                  @click.stop="filters[col.name] = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </q-th>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import Dexie from "dexie";
import db from "../db/db.js";
import Utils from "../db/utils.js";
export default {
  data () {
    return {
      filter: "",
      filters: {},
      loading: false,
      pagination: {
        sortBy: undefined,
        descending: false,
        page: 1,
        rowsPerPage: 3,
        rowsNumber: 10
      },
      columns: [],
      data: [],
      original: []
    };
  },
  mounted () {
    // get initial data from server (1st page)
    this.onRequest({
      pagination: this.pagination,
      filter: undefined,
      firsttime: 1
    });
  },
  methods: {
    onRequest (props) {
      let self = this;
      const { page, rowsPerPage, sortBy, descending } = props.pagination;

      this.loading = true;

      // emulate server with dexie indexeddb

      // calculate starting row of data
      const startRow = (page - 1) * rowsPerPage;

      // var data = [];
      fetch('https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json').then(response => {
        return response.json()
      }).then(data => {
        self.original = data.pokemon;
        return Utils.exists();
      }).then(response => {
        let columns = Object.keys(self.original[0]);
        self.columns = columns.filter(col => col != 'img').map(col => {
          return {
            name: col,
            type: typeof self.original[0][col],
            field: col,
            label: col,
            sortable: true
          }
        })
        return Utils.create(columns);
      }).then(response => {
        console.log('initialized ', response);
        return Utils.bulkAdd(self.original);
      }).then(response => {
        console.log('filled data ', response);
      }).catch(error => {
        console.log('Error ', error);
      }).then(response => {
        if (sortBy) {
          if (descending) {
            var sort_response = db.deserts.orderBy(sortBy).reverse()
          } else {
            var sort_response = db.deserts.orderBy(sortBy)
          }
        } else {
          sort_response = db.deserts.toCollection();
        }
        let actual_filters = Object.keys(self.filters).filter(column => ((self.filters[column] || '') !== ''));
        // if (actual_filters.length > 0) {
        var filter_response = sort_response.filter(row => {
          let filter_count = actual_filters.map((column) => {
            return row[column].toString().toLowerCase().indexOf(self.filters[column].toLowerCase()) > -1;
          }).indexOf(false) < 0;
          return filter_count
        });
        filter_response.count().then(count => {
          self.pagination.rowsNumber = count;
        });
        return filter_response
          .offset(startRow)
          .limit(rowsPerPage)
          .toArray();
      }).then(response => {
        console.log('final response ', response);
        // clear out existing data and add new
        this.data.splice(0, this.data.length, ...response);
        // don't forget to update local pagination object
        this.pagination.page = page;
        this.pagination.rowsPerPage = rowsPerPage;
        this.pagination.sortBy = sortBy;
        this.pagination.descending = descending;

        // ...and turn of loading indicator
        this.loading = false;
      }).catch(error => {
        console.log(`Error ${error}`);
      });;
    }
  }
};
</script>
