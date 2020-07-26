'use strict';

import TableRender from './TableRender';

class Table {
    constructor(count) {
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
            currentSort: null,
            limit: 50,
            page: 1,
        };

        this.dataName = {
            table: 'table',
            tableSortLink: 'table-sort',
            tableHead: 'table-head',
            pagination: 'table-pagination',
            tablePage: 'table-page',
            tableRow: 'table-row',
            tableRowInfo: 'table-row-info',
            tableActions: 'table-actions',
        };

        this.className = {
            active: 'active',
            disable: 'disable',
            asc: 'asc',
            desc: 'desc',
        };

        this.apiUrl = `http://www.filltext.com/?rows=${this.options.elementsCount}&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}`;

        // if (this.options.elementsCount > 50) this.apiUrl += `&delay=${this.options.delay}`;

        this.getData().then(res => {
            this.data = res;
            this.dataDefault = [...this.data];
            this.setTableTotalPages(this.totalPages);
            this.init();
        }).catch(err => {
            console.log(err);
            throw new Error('Что-то пошло не так');
        });

        this.$table = document.querySelector(`[data-${this.dataName.table}]`);
        this.$pagination = document.querySelector(`[data-${this.dataName.pagination}]`);
    }

    async getData(){
        let data = null;

        this.options.isLoading = true;
        window.nx.helpers.insertPreloader(document.body, false, 'content');

        try {
            const response =  await fetch(this.apiUrl);
            data = await response.json();
        } catch (e) {
            console.log(e);
            throw new Error('Во время загрузки, возникла ошибка');
        }

        this.options.isLoading = false;
        window.nx.helpers.hidePreloader(document.body, false);

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

    setTableTotalPages(val){
        this.table.totalPages = val;
    }

    init(){
        if (!this.data) return false;

        this.render();
    }

    setPage(e){
        e.preventDefault();

        const type = e.currentTarget.getAttribute(`data-${this.dataName.tablePage}`);

        if (e.currentTarget.classList.contains(this.className.active) || e.currentTarget.classList.contains(this.className.disable)) return false;

        this.removeSiblingsActiveClass(e.currentTarget);

        if (type === 'next') {
            if (this.table.page < this.totalPages) this.table.page +=1;
        } else if (type === 'prev') {
            if (this.table.page > 1) this.table.page -=1;
        } else {
            e.currentTarget.classList.add(this.className.active);
            this.table.page = Number(type);
        }

        this.render('body');
    }

    setSort(e){
        e.preventDefault();
        const value = e.currentTarget.getAttribute(`data-${this.dataName.tableSortLink}`);

        this.removeSiblingsActiveClass(e.currentTarget.parentNode, `[data-${this.dataName.tableSortLink}]`, [this.className.asc, this.className.desc]);

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

        this.render('body');
    }

    showRowDetails(e){
        e.preventDefault();
        let detail = e.currentTarget.getAttribute(`data-${this.dataName.tableRow}`);
        detail = JSON.parse(detail);

        const $rowInfo = document.querySelector(`[data-${this.dataName.tableRowInfo}]`);
        if ($rowInfo) $rowInfo.remove();

        if (!e.currentTarget.classList.contains(this.className.active)){
            this.$table.insertAdjacentHTML('afterend', TableRender.generateRowInfo(detail));
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }

        e.currentTarget.classList.toggle(this.className.active);

        this.removeSiblingsActiveClass(e.currentTarget);
    }

    removeSiblingsActiveClass(target, child, classes){
        const $siblings = target.siblingsElement();
        $siblings.forEach(el => {
            if (!child){
                el.classList.remove(this.className.active);
            } else {
                el.querySelector(child).classList.remove(...classes);
            }
        });
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
        const $sortLinks = document.querySelectorAll(`[data-${this.dataName.tableSortLink}]`);
        this.setSort = this.setSort.bind(this);

        $sortLinks.forEach($link =>{
            $link.addEventListener('click', this.setSort, true);
        });

        const $tablePageLinks = document.querySelectorAll(`[data-${this.dataName.tablePage}]`);
        this.setPage = this.setPage.bind(this);

        $tablePageLinks.forEach($link =>{
            $link.addEventListener('click', this.setPage, true);
        });

        const $tableRows = document.querySelectorAll(`[data-${this.dataName.tableRow}]`);
        this.showRowDetails = this.showRowDetails.bind(this);

        $tableRows.forEach($link =>{
            $link.addEventListener('click', this.showRowDetails, true);
        });
    }

    unBindEvents(){
        const $sortLinks = document.querySelectorAll(`[data-${this.dataName.tableSortLink}]`);
        $sortLinks.forEach($link =>{
            $link.removeEventListener('click', this.setSort, true);
        });

        const $tablePageLinks = document.querySelectorAll(`[data-${this.dataName.tablePage}]`);
        $tablePageLinks.forEach($link =>{
            $link.removeEventListener('click', this.setPage, true);
        });

        const $tableRows = document.querySelectorAll(`[data-${this.dataName.tableRow}]`);

        $tableRows.forEach($link =>{
            $link.removeEventListener('click', this.showRowDetails, true);
        });
    }

    static build(){
        document.addEventListener('DOMContentLoaded', () => {
            const $tableBuild = document.querySelectorAll('[data-table-build]');

            $tableBuild.forEach(link => {
                link.addEventListener('click', (e) => {
                    const cnt = e.currentTarget.getAttribute('data-table-build');
                    new Table(Number(cnt));
                });
            });
        });
    }
}

export default Table;