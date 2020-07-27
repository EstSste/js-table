'use strict';

import TableRender from './TableRender';

class TableRowDetails{
    constructor() {
        this.className = {
            active: 'active'
        };

        this.dataName = {
            table: 'table',
            tableRow: 'table-row',
            tableRowInfo: 'table-row-info',
        };

        this.$table = document.querySelector(`[data-${this.dataName.table}]`);
    }

    updateData(e){
        this.showRowDetails(e);
        return {};
    }

    showRowDetails(e){
        e.preventDefault();
        let detail = e.currentTarget.getAttribute(`data-${this.dataName.tableRow}`);
        detail = JSON.parse(detail);

        const $rowInfo = document.querySelector(`[data-${this.dataName.tableRowInfo}]`);
        if ($rowInfo) $rowInfo.remove();

        if (!e.currentTarget.classList.contains(this.className.active)){
            this.$table.insertAdjacentHTML('afterend', new TableRender().generateRowInfo(detail));
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }

        e.currentTarget.classList.toggle(this.className.active);

        const $siblings = e.currentTarget.siblingsElement();
        $siblings.forEach(el => {
            el.classList.remove(this.className.active);
        });
    }
}

export default TableRowDetails