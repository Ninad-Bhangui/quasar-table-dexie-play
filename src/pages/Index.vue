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
      columns: [
        {
          name: "name",
          required: true,
          label: "Dessert (100g serving)",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true,
          type: "varchar"
        },
        {
          name: "calories",
          align: "center",
          label: "Calories",
          field: "calories",
          sortable: true
        },
        { name: "fat", label: "Fat (g)", field: "fat", sortable: true },
        { name: "carbs", label: "Carbs (g)", field: "carbs", sortable: true },
        {
          name: "protein",
          label: "Protein (g)",
          field: "protein",
          sortable: true
        },
        {
          name: "sodium",
          label: "Sodium (mg)",
          field: "sodium",
          sortable: true
        },
        {
          name: "calcium",
          label: "Calcium (%)",
          field: "calcium",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        },
        {
          name: "iron",
          label: "Iron (%)",
          field: "iron",
          sortable: true,
          sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
        }
      ],
      data: [],
      original: [
        {
          id: 1,
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: "14%",
          iron: "1%"
        },
        {
          id: 2,
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: "8%",
          iron: "1%"
        },
        {
          id: 3,
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: "6%",
          iron: "7%"
        },
        {
          id: 4,
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: "3%",
          iron: "8%"
        },
        {
          id: 5,
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: "7%",
          iron: "16%"
        },
        {
          id: 6,
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: "0%",
          iron: "0%"
        },
        {
          id: 7,
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: "0%",
          iron: "2%"
        },
        {
          id: 8,
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: "0%",
          iron: "45%"
        },
        {
          id: 9,
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: "2%",
          iron: "22%"
        },
        {
          id: 10,
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: "12%",
          iron: "6%"
        },
        {
          id: 11,
          name: "Frozen Yogurt-1",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: "14%",
          iron: "1%"
        },
        {
          id: 12,
          name: "Ice cream sandwich-1",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: "8%",
          iron: "1%"
        },
        {
          id: 13,
          name: "Eclair-1",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: "6%",
          iron: "7%"
        },
        {
          id: 14,
          name: "Cupcake-1",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: "3%",
          iron: "8%"
        },
        {
          id: 15,
          name: "Gingerbread-1",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: "7%",
          iron: "16%"
        },
        {
          id: 16,
          name: "Jelly bean-1",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: "0%",
          iron: "0%"
        },
        {
          id: 17,
          name: "Lollipop-1",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: "0%",
          iron: "2%"
        },
        {
          id: 18,
          name: "Honeycomb-1",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: "0%",
          iron: "45%"
        },
        {
          id: 19,
          name: "Donut-1",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: "2%",
          iron: "22%"
        },
        {
          id: 20,
          name: "KitKat-1",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: "12%",
          iron: "6%"
        },
        {
          id: 21,
          name: "Frozen Yogurt-2",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: "14%",
          iron: "1%"
        },
        {
          id: 22,
          name: "Ice cream sandwich-2",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: "8%",
          iron: "1%"
        },
        {
          id: 23,
          name: "Eclair-2",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: "6%",
          iron: "7%"
        },
        {
          id: 24,
          name: "Cupcake-2",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: "3%",
          iron: "8%"
        },
        {
          id: 25,
          name: "Gingerbread-2",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: "7%",
          iron: "16%"
        },
        {
          id: 26,
          name: "Jelly bean-2",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: "0%",
          iron: "0%"
        },
        {
          id: 27,
          name: "Lollipop-2",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: "0%",
          iron: "2%"
        },
        {
          id: 28,
          name: "Honeycomb-2",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: "0%",
          iron: "45%"
        },
        {
          id: 29,
          name: "Donut-2",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: "2%",
          iron: "22%"
        },
        {
          id: 30,
          name: "KitKat-2",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: "12%",
          iron: "6%"
        },
        {
          id: 31,
          name: "Frozen Yogurt-3",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          sodium: 87,
          calcium: "14%",
          iron: "1%"
        },
        {
          id: 32,
          name: "Ice cream sandwich-3",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          sodium: 129,
          calcium: "8%",
          iron: "1%"
        },
        {
          id: 33,
          name: "Eclair-3",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          sodium: 337,
          calcium: "6%",
          iron: "7%"
        },
        {
          id: 34,
          name: "Cupcake-3",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          sodium: 413,
          calcium: "3%",
          iron: "8%"
        },
        {
          id: 35,
          name: "Gingerbread-3",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          sodium: 327,
          calcium: "7%",
          iron: "16%"
        },
        {
          id: 36,
          name: "Jelly bean-3",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          sodium: 50,
          calcium: "0%",
          iron: "0%"
        },
        {
          id: 37,
          name: "Lollipop-3",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          sodium: 38,
          calcium: "0%",
          iron: "2%"
        },
        {
          id: 38,
          name: "Honeycomb-3",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          sodium: 562,
          calcium: "0%",
          iron: "45%"
        },
        {
          id: 39,
          name: "Donut-3",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          sodium: 326,
          calcium: "2%",
          iron: "22%"
        },
        {
          id: 40,
          name: "KitKat-3",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          sodium: 54,
          calcium: "12%",
          iron: "6%"
        }
      ]
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

      //Init and open db if not exist
      let columns = this.columns
        .map(i => i.name);

      Utils.exists().then(response => {
        return Utils.create(columns);
      }).then(response => {
        console.log('initialized ', response);
        return Utils.bulkAdd(this.original);
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
