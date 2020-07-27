class TableSearch {
    constructor(data) {
        this.className = {
        };

        this.dataName = {
            tableSearch: 'table-search'
        };

        this.table = (data && data.table) ? {...this.table, ...data.table} : {};

        this.data = (data && data.data) ? data.data : [];
        this.dataDefault = (data && data.dataDefault) ? data.dataDefault : [];
    }

    updateData(e){
        this.search(e);

        if (this.data && !this.data.length && this.value)
            window.nx.alert.show('Ничего не найдено', 'info');

        return {
            table: this.table,
            data: (this.value) ? this.data : this.dataDefault
        };
    }

    search(e){
        e.preventDefault();
        const $input = e.currentTarget.closest(`[data-${this.dataName.tableSearch}]`).querySelector('input');
        this.value = String($input.value).toLowerCase();

        this.table.currentSort = null;
        this.table.page = 1;

        this.data = this.dataDefault.filter(el => {
            for (let key in el){
                const str = String(el[key]).toLowerCase();

                if (typeof el[key] !== 'object' && str.includes(this.value)){
                    return el;
                }
            }
        });
    }
}

export default TableSearch;