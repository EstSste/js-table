'use strict';

class TableSort{
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

    updateData(e){
        this.setSort(e);
        return {
            table: this.table,
            data: this.data
        };
    }

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
                    this.table.currentSort = null;
                    e.currentTarget.classList.remove(this.className.asc, this.className.desc);
                    break;
            }
        } else {
            e.currentTarget.classList.add(this.className.asc);
            this.table.currentSort = {
                value: value,
                dir: this.className.asc
            };
        }

        this.sortProducts();
    }

    sortProducts() {
        let products = [...this.data];

        if (this.table.currentSort){
            const compare = (a, b) => {
                return (a[this.table.currentSort.value] > b[this.table.currentSort.value]) ? 1 : -1;
            };

            products = products.sort(compare);
        }

        if (this.table.currentSort && this.table.currentSort.dir === this.className.asc){
            this.data = products;
        } else if (this.table.currentSort && this.table.currentSort.dir === this.className.desc){
            this.data = products.reverse();
        } else if (!this.table.currentSort) {
            this.data = [...this.dataDefault];
        }
    }
}

export default TableSort