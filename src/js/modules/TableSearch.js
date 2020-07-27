class TableSearch {
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

    updateData(e){
        this.search(e);

        if (this.data && !this.data.length && this.value)
            window.nx.alert.show('Ничего не найдено', 'info');

        return {
            table: this.table,
            // data: (this.value) ? this.data : this.dataDefault
            data: this.data
        };
    }

    search(e){
        e.preventDefault();
        const $input = e.currentTarget.closest(`[data-${this.dataName.tableSearch}]`).querySelector('input');
        this.value = String($input.value).toLowerCase();

        this.prepareData();

        this.data = this.dataDefault.filter(el => {
            for (let key in el){
                const str = String(el[key]).toLowerCase();

                if (typeof el[key] !== 'object' && str.includes(this.value)){
                    return el;
                }
            }
        });
    }

    prepareData(){
        if (this.table.page) this.table.page = 1;

        if (this.table.currentSort){
            const compare = (a, b) => {
                return (a[this.table.currentSort.value] > b[this.table.currentSort.value]) ? 1 : -1;
            };
            this.dataDefault = this.dataDefault.sort(compare);
            if (this.table.currentSort && this.table.currentSort.dir === this.className.desc)
                this.dataDefault = this.dataDefault.reverse();
        }
    }
}

export default TableSearch;