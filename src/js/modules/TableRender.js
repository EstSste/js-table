'use strict';

class TableRender {
    constructor(table, data) {
        this.options = {
            visiblePageCount: 3
        };

        this.className = {
            table: 'products-table',
            pagination: 'pagination',
            details: 'attrs'
        };

        this.table = table;
        this.data = data;
    }

    generateHead() {
        const headItems = this.table.columns.map(cell => {
            let sortClass = '';
            if (this.table.currentSort){
                sortClass = (this.table.currentSort.dir === 'desc') ? 'desc' : (this.table.currentSort.dir === 'asc') ? 'asc' : '';
            }
            return `
                <div class="${this.className.table}__cell">
                    <a href="#" class="${this.className.table}__link ${sortClass}" data-table-update="sort" data-table-sort="${cell.value}">
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
                <div class="${this.className.table}__row" data-table-row='${JSON.stringify(product)}' data-table-update="details">
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
                pages += `<span class="${this.className.pagination}__pages-dots">...</span>`;
            }

            const activeClass = (Number(this.table.page) === page) ? 'active' : '';

            pages += `
                <a href="#" class="${this.className.pagination}__pages-link ${activeClass}" data-table-page="${page}" data-table-update="pagination">
                    <span>${page}</span>
                </a>
            `;

            if (isRightDotsShown) {
                pages += `<span class="${this.className.pagination}__pages-dots">...</span>`;
            }
        }

        return `
            <div class="${this.className.pagination}">
                <a href="#" class="${this.className.pagination}__arrow" data-table-page="prev" data-table-update="pagination">
                    <i class="mdi mdi-arrow-left ${this.className.pagination}__arrow-icon"></i>
                </a>
                <div class="${this.className.pagination}__pages">
                    ${pages}
                </div>
                <a href="#" class="${this.className.pagination}__arrow" data-table-page="next" data-table-update="pagination">
                    <i class="mdi mdi-arrow-right ${this.className.pagination}__arrow-icon"></i>
                </a>
            </div>
        `;
    }

    generateRowInfo(row){
        if (!row) return ``;

        const notSpecifiedText = 'не указано';
        const firstName = (row.firstName) ? row.firstName : 'notSpecifiedText';
        const lastName = (row.lastName) ? row.lastName : 'notSpecifiedText';
        const street = (row.adress && row.adress.streetAddress) ? row.adress.streetAddress : notSpecifiedText;
        const city = (row.adress && row.adress.city) ? row.adress.city : notSpecifiedText;
        const state = (row.adress && row.adress.state) ? row.adress.state : notSpecifiedText;
        const zip = (row.adress && row.adress.zip) ? row.adress.zip : notSpecifiedText;
        const description = (row.description) ? row.description : notSpecifiedText;

        return `
            <div class="${this.className.details} content-narrow form-group" data-table-row-info>
                <div class="${this.className.details}__el">
                    <div class="${this.className.details}__name">Выбран пользователь</div>
                    <div class="${this.className.details}__val"><b>${firstName} ${lastName}</b></div>
                </div>
                <div class="${this.className.details}__el">
                    <div class="${this.className.details}__name">Адрес проживания</div>
                    <div class="${this.className.details}__val"><b>${street}</b></div>
                </div>
                <div class="${this.className.details}__el">
                    <div class="${this.className.details}__name">Город</div>
                    <div class="${this.className.details}__val"><b>${city}</b></div>
                </div>
                <div class="${this.className.details}__el">
                    <div class="${this.className.details}__name">Провинция/штат</div>
                    <div class="${this.className.details}__val"><b>${state}</b></div>
                </div>
                <div class="${this.className.details}__el">
                    <div class="${this.className.details}__name">Индекс</div>
                    <div class="${this.className.details}__val"><b>${zip}</b></div>
                </div>
                <div class="${this.className.details}__el ${this.className.details}__el_fw">
                    <div class="${this.className.details}__name">Описание</div>
                    <div class="${this.className.details}__val"><b>${description}</b></div>
                </div>
            </div>
        `;
    }
}

export default TableRender