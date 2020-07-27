'use strict';

import TableRender from './TableRender';
import TableSort from './TableSort';
import TablePagination from './TablePagination';
import TableRowDetails from './TableRowDetails';
import TableSearch from './TableSearch';

class Table {
    constructor(count, actions) {

        this.options = {
            elementsCount: count || 1000,
            isLoading: false,
            delay: 3
        };

        this.table = {
            columns: [
                {
                    name: 'id',
                    value: 'id',
                    isSorted: false,
                },
                {
                    name: 'firstName',
                    value: 'firstName',
                    isSorted: false,
                },
                {
                    name: 'lastName',
                    value: 'lastName',
                    isSorted: false,
                },
                {
                    name: 'email',
                    value: 'email',
                    isSorted: false,
                },
                {
                    name: 'phone',
                    value: 'phone',
                    isSorted: false,
                }
            ],
            limit: 50,
            page: 1,
        };

        this.actions = {
            ...actions
        };

        this.dataName = {
            table: 'table',
            tableHead: 'table-head',
            pagination: 'table-pagination',
            tableActions: 'table-actions',
            tableUpdate: 'table-update',
            tableWrap: 'table-wrap',
            tableSearch: 'table-search',
        };

        this.className = {
            hidden: 'hidden',
        };

        this.apiUrl = `http://www.filltext.com/?rows=${this.options.elementsCount}&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}`;

        if (this.options.elementsCount > 50) this.apiUrl += `&delay=${this.options.delay}`;

        this.$table = document.querySelector(`[data-${this.dataName.table}]`);
        this.$tableWrap = document.querySelector(`[data-${this.dataName.tableWrap}]`);
        this.$pagination = document.querySelector(`[data-${this.dataName.pagination}]`);
        this.$search = document.querySelector(`[data-${this.dataName.tableSearch}]`);

        this.getData().then(res => {
            this.data = res;
            this.dataDefault = [...this.data];
            this.table.totalPages = this.totalPages;
            this.init();
        }).catch(err => {
            console.log(err);
            window.nx.alert.show('Что-то пошло не так', 'error');
            // throw new Error('Что-то пошло не так');
        });
    }

    async getData(){
        let data = null;

        this.options.isLoading = true;
        window.nx.helpers.insertPreloader(document.body, false, 'content');

        this.$tableWrap.classList.add(this.className.hidden);

        try {
            const response =  await fetch(this.apiUrl);
            data = await response.json();
            window.nx.alert.show('Данные успешно загружены', 'success');
        } catch (e) {
            console.log(e);
            window.nx.alert.show('Во время загрузки, возникла ошибка', 'error');
            // throw new Error('Во время загрузки, возникла ошибка');
        } finally {
            this.options.isLoading = false;
            window.nx.helpers.hidePreloader(document.body, false);
        }

        this.$tableWrap.classList.remove(this.className.hidden);

        return data;
    }

    get dataLength(){
        return (this.data && this.data.length) ? this.data.length : 0;
    }

    get currentPageMax(){
        return (this.table.limit * this.table.page < this.dataLength) ? this.table.limit * this.table.page : this.dataLength.length;
    }

    get currentPageMin(){
        return (this.table.page - 1) * this.table.limit;
    }

    get products(){
        return this.data.slice(this.currentPageMin, this.currentPageMax);
    }

    get totalPages(){
        return Math.ceil(this.dataLength/this.table.limit)
    }

    init(){
        if (!this.data) return false;

        this.render();
    }

    updateTable(e){
        const type = e.currentTarget.getAttribute(`data-${this.dataName.tableUpdate}`);

        const data = {
            table: this.table,
            data: this.data,
            dataDefault: this.dataDefault
        };

        let Constructor = this.actions[type];

        try {
            Constructor = new Constructor(data);
        } catch (e) {
            console.warn(`Конструктор ${type} не найден`, e);
            return false;
        }

        try {
            const {table, data} = Constructor.updateData(e);
            if (table) this.table = {...this.table, ...table};
            if (data) {
                this.data = [...data];
                this.table.totalPages = this.totalPages;
                this.render('body');
            }
        } catch (e) {
            console.log(e);
            throw new Error('Конструктор должен содержать метод updateData');
        }
    }

    render(type){
        this.unBindEvents();

        const tableRender = new TableRender(this.table, this.products);

        if (type === 'body') {
            let $rows = this.$table.querySelector(`[data-${this.dataName.tableHead}]`).siblingsElement();
            $rows.forEach(el => {
                el.remove();
            });

            this.$table.insertAdjacentHTML('beforeend', tableRender.generateBody());
        } else {
            this.$table.innerHTML = tableRender.generateFullTable();
        }

        this.$pagination.innerHTML = tableRender.generatePagination();

        this.bindEvents();
    }

    bindEvents(){
        const $updateLinks = document.querySelectorAll(`[data-${this.dataName.tableUpdate}]`);
        this.updateTable = this.updateTable.bind(this);

        $updateLinks.forEach($link =>{
            const listenerType = ($link.tagName.toLowerCase() === 'input') ? 'change' : 'click';
            $link.addEventListener(listenerType, this.updateTable, true);
        });
    }

    unBindEvents(){
        const $updateLinks = document.querySelectorAll(`[data-${this.dataName.tableUpdate}]`);

        $updateLinks.forEach($link =>{
            const listenerType = ($link.tagName.toLowerCase() === 'input') ? 'change' : 'click';
            $link.removeEventListener(listenerType, this.updateTable, true);
        });
    }

    destroy(){
        this.unBindEvents();
        if (this.$table) this.$table.innerHTML = '';
        if (this.$pagination) this.$pagination.innerHTML = '';
        if (this.$search) this.$search.querySelector('input').value = '';
        window.table = null;
    }

    static build(){
        document.addEventListener('DOMContentLoaded', () => {
            const $tableBuild = document.querySelectorAll('[data-table-build]');

            $tableBuild.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const cnt = e.currentTarget.getAttribute('data-table-build');

                    if (window.table) window.table.destroy();

                    window.table = new Table(Number(cnt), {
                        pagination: TablePagination,
                        sort: TableSort,
                        details: TableRowDetails,
                        search: TableSearch
                    });
                });
            });
        });
    }
}

export default Table;