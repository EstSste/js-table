'use strict';

class TableSort{
    /**
     * Sorts the data
     * @param data {Array}
     */
    constructor(data) {
        this.className = {
            asc: 'asc',
            desc: 'desc',
        };

        this.dataName = {
            tableSortLink: 'table-sort',
        };

        this.table = (data && data.table) ? {...this.table, ...data.table} : {currentSort: null};

        this.data = (data && data.data) ? data.data : [];
        this.dataDefault = (data && data.dataDefault) ? data.dataDefault : [];
    }

    /**
     * Returns updated data and table properties
     * @param e{Event}
     * @returns {{data: [], table: {}}}
     */
    updateData(e){
        this.setSort(e);
        return {
            table: this.table,
            data: this.data
        };
    }

    /**
     * Renders items and starts sorting data
     * @param e{Event}
     */
    setSort(e){
        e.preventDefault();
        const value = e.currentTarget.getAttribute(`data-${this.dataName.tableSortLink}`);

        const $siblings = e.currentTarget.parentNode.siblingsElement();
        $siblings.forEach(el => {
            el.querySelector(`[data-${this.dataName.tableSortLink}]`).classList.remove(this.className.asc, this.className.desc);
        });

        if (this.table.currentSort && value === this.table.currentSort.value){
            switch (this.table.currentSort.dir) {
                case this.className.asc:
                    e.currentTarget.classList.remove(this.className.asc);
                    e.currentTarget.classList.add(this.className.desc);

                    this.table.currentSort.dir = this.className.desc;
                    break;
                case this.className.desc:
                    e.currentTarget.classList.remove(this.className.desc);
                    e.currentTarget.classList.add(this.className.asc);

                    this.table.currentSort.dir = this.className.asc;
                    //TODO if there is a default sorting - modify
                    // this.table.currentSort = null;
                    // e.currentTarget.classList.remove(this.className.asc, this.className.desc);
                    break;
            }
        } else {
            e.currentTarget.classList.add(this.className.asc);
            this.table.currentSort = {
                value: value,
                dir: this.className.asc
            };
        }

        this.data = TableSort.sort(this.table, this.data);
    }

    /**
     * Clear active sort
     * @returns {{table: {} || null}}
     */
    clear(){
        this.table.currentSort = null;

        return {
            table: this.table
        };
    }

    /**
     * Sorts an array of data and returns it
     * @param table {Object}
     * @param data {Array}
     * @returns {Array}
     */
    static sort(table, data) {
        let products = [...data];

        if (table.currentSort){
            const compare = (a, b) => {
                return (a[table.currentSort.value] > b[table.currentSort.value]) ? 1 : -1;
            };

            products = products.sort(compare);
        }

        if (table.currentSort && table.currentSort.dir === 'asc'){
            return products;
        } else if (table.currentSort && table.currentSort.dir === 'desc'){
            return products.reverse();
        }

        return [...products];
    }
}

export default TableSort