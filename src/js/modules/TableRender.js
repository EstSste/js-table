'use strict';

class TableRender {
    constructor(table, data) {
        this.options = {
            visiblePageCount: 3
        };

        this.className = {
            table: 'products-table'
        };

        this.table = table;
        this.data = data;
    }

    generateHead() {
        const headItems = this.table.columns.map(cell => {
            let sortClass = '',
                activeClass = '';
            if (this.table.currentSort){
                activeClass = (cell.value === this.table.currentSort.value) ? 'active' : '';
                sortClass = (this.table.currentSort.dir === 'desc') ? 'desc' : (this.table.currentSort.dir === 'asc') ? 'asc' : '';
            }
            return `
                <div class="${this.className.table}__cell ${sortClass} ${activeClass}">
                    <a href="#" class="${this.className.table}__link" data-table-sort="${cell.value}">
                        ${cell.name}
                    </a>
                </div>
            `;
        });

        return headItems.join('');
    }

    generateBody(){
        const bodyItems = this.data.map(product => {
            const cell = this.table.columns.map(cell => {
                return `
                    <div class="${this.className.table}__cell">
                        ${product[cell.value]}
                    </div>
                `;
            });

            return `
                <div class="${this.className.table}__row" data-table-row='${JSON.stringify(product)}'>
                    ${cell.join('')}
                </div>
            `;
        });

        return bodyItems.join('');
    }

    generateFullTable(){
        return `
            <div class="${this.className.table}__row ${this.className.table}__head" data-table-head>
                ${this.generateHead()}
            </div>
            ${this.generateBody()}
        `;
    }

    generatePagination(){
        if (this.table.totalPages <= 1) return '';

        let pages = '';

        for (let page = 1; page <= this.table.totalPages; page++){
            const absoluteNum = Math.abs(page - this.table.page)
            const isShown =  absoluteNum < this.options.visiblePageCount || page === this.table.totalPages || page === 1;

            const isLeftDotsShown = page === this.table.totalPages && absoluteNum > this.options.visiblePageCount;
            const isRightDotsShown = page === 1 && absoluteNum > this.options.visiblePageCount;

            if (!isShown) continue;

            if (isLeftDotsShown) {
                pages += `<span class="pagination__pages-dots">...</span>`;
            }

            const activeClass = (Number(this.table.page) === page) ? 'active' : '';

            pages += `
                <a href="#" class="pagination__pages-link ${activeClass}" data-table-page="${page}">
                    <span>${page}</span>
                </a>
            `;

            if (isRightDotsShown) {
                pages += `<span class="pagination__pages-dots">...</span>`;
            }
        }

        return `
            <div class="pagination">
                <a href="#" class="pagination__arrow" data-table-page="prev">
                    <i class="mdi mdi-arrow-left pagination__arrow-icon"></i>
                </a>
                <div class="pagination__pages">
                    ${pages}
                </div>
                <a href="#" class="pagination__arrow" data-table-page="next">
                    <i class="mdi mdi-arrow-right pagination__arrow-icon"></i>
                </a>
            </div>
        `;
    }

    static generateRowInfo(row){
        return `
            <div class="attrs content-narrow form-group" data-table-row-info>
                <div class="attrs__el">
                    <div class="attrs__name">Выбран пользователь</div>
                    <div class="attrs__val"><b>${row.firstName} ${row.lastName}</b></div>
                </div>
                <div class="attrs__el">
                    <div class="attrs__name">Адрес проживания</div>
                    <div class="attrs__val"><b>${row.adress.streetAddress}</b></div>
                </div>
                <div class="attrs__el">
                    <div class="attrs__name">Город</div>
                    <div class="attrs__val"><b>${row.adress.city}</b></div>
                </div>
                <div class="attrs__el">
                    <div class="attrs__name">Провинция/штат</div>
                    <div class="attrs__val"><b>${row.adress.state}</b></div>
                </div>
                <div class="attrs__el">
                    <div class="attrs__name">Индекс</div>
                    <div class="attrs__val"><b>${row.adress.zip}</b></div>
                </div>
                <div class="attrs__el attrs__el_fw">
                    <div class="attrs__name">Описание</div>
                    <div class="attrs__val"><b>${row.description}</b></div>
                </div>
            </div>
        `;
    }
}

export default TableRender