'use strict';

class TablePagination{
    /**
     * Creates pagination for a table
     * @param data {Array}
     */
    constructor(data) {
        this.className = {
            active: 'active',
            disable: 'disable',
        };

        this.dataName = {
            tablePage: 'table-page',
        };

        this.table = (data && data.table) ? {...data.table} : {};

        this.data = (data && data.data) ? data.data : [];
    }

    /**
     * Returns updated data and table properties
     * @param e{Event}
     * @returns {{data: [], table: {}}}
     */
    updateData(e){
        this.setPage(e);
        return {
            table: this.table,
            data: this.data
        };
    }

    /**
     * Sets the active page to the DOM and table properties
     * @param e{Event}
     * @returns {boolean}
     */
    setPage(e){
        e.preventDefault();

        const type = e.currentTarget.getAttribute(`data-${this.dataName.tablePage}`);

        if (e.currentTarget.classList.contains(this.className.active) || e.currentTarget.classList.contains(this.className.disable)) return false;

        const $siblings = e.currentTarget.siblingsElement();
        $siblings.forEach(el => {
            el.classList.remove(this.className.active);
        });

        if (type === 'next') {
            if (this.table.page < this.table.totalPages) this.table.page +=1;
        } else if (type === 'prev') {
            if (this.table.page > 1) this.table.page -=1;
        } else {
            e.currentTarget.classList.add(this.className.active);
            this.table.page = Number(type);
        }
    }

    /**
     * Clear active page
     * @returns {{table: {} || null}}
     */
    clear(){
        this.table.page = 1;

        return {
            table: this.table
        };
    }
}

export default TablePagination