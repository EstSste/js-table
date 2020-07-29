'use strict';

class TableSearch {
    /**
     * Searches by entry
     * @param data {Array}
     */
    constructor(data) {
        this.className = {
            desc: 'desc'
        };

        this.dataName = {
            tableSearch: 'table-search'
        };

        this.table = (data && data.table) ? {...this.table, ...data.table} : {};

        this.data = (data && data.data) ? data.data : [];
        this.dataDefault = (data && data.dataDefault) ? data.dataDefault : [];
    }

    /**
     * Returns updated data and table properties
     * @param e{Event}
     * @returns {{data: [], table: {}}}
     */
    updateData(e){
        this.search(e);

        if (this.data && !this.data.length && this.table.value)
            window.nx.alert.show('Ничего не найдено', 'info');

        return {
            table: this.table,
            // data: (this.table.value) ? this.data : this.dataDefault
            data: this.data
        };
    }

    /**
     * Searches by entry, except Object
     * @param e {Event}
     */
    search(e){
        e.preventDefault();
        const $input = e.currentTarget.closest(`[data-${this.dataName.tableSearch}]`).querySelector('input');
        this.table.value = String($input.value).toLowerCase();

        if (this.table.page) this.table.page = 1;

        this.data = this.dataDefault.filter(el => {
            for (let key in el){
                if (el.hasOwnProperty(key)) {
                    const str = String(el[key]).toLowerCase();

                    if (typeof el[key] !== 'object' && str.includes(this.table.value)){
                        return el;
                    }
                }

            }
        });
    }

    /**
     * Cancel search
     * @returns {Object}
     */
    clear(){
        const $searchBlocks = document.querySelectorAll(`[data-${this.dataName.tableSearch}]`);
        $searchBlocks.forEach(el => {
            const $input = el.querySelector('input');
            $input.value = '';
        });
        this.table.value = '';

        return {
            table: this.table
        };
    }
}

export default TableSearch;