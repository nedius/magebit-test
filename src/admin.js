let emails = [],
    emails_filtered = [],
    emails_domain = [],
    orderBy,
    orderSort,
    filterBy,
    perPage,
    cPage,
    selectAllBtn;

let app = new Vue({ 
    el: "#app", 

    data() {
        return {
            emails,
            emails_filtered,
            emails_domain,
            orderBy,
            orderSort,
            filterBy,
            perPage,
            cPage,
        };
    },

    mounted(){
        // console.log("vue mounted");
        this.getEmails();
        this.orderBy = `date`;
        this.orderSort = `new`;
        this.perPage = 10;
        this.cPage = 1;
    },

    methods:{
        async getEmails(){
            axios.get('./api/get.php', {
                params: {
                    limit: -1,
                    offset: 0,
                }
            })
            .then(response =>{
                this.emails = response.data;
                this.emails_filtered = this.emails;

                this.getDomains();
                this.filter();
                this.changePage();
            });
        },
        getDomains(){
            this.emails.forEach(obj => {
                let domain = obj.email.split(`@`)[1].split(`.`).shift();

                if(!this.emails_domain.includes(domain)) {
                    this.emails_domain.push(domain);
                }
            });
        },
        sort(){
            // console.log(`sort`, this.orderBy, this.orderSort);
            switch (this.orderBy) {
                case `id`:
                    this.emails_filtered.sort((a, b) => this.orderSort == `new` ? a.id - b.id : b.id - a.id );
                    break;
                case `email`:
                    this.emails_filtered.sort((a,b) => (a.email > b.email) ? (this.orderSort == `new` ? 1 : -1) : ((b.email > a.email) ? (this.orderSort == `new` ? -1 : 1) : 0) );
                    break;
                case `date`:
                    this.emails_filtered.sort((a, b) => {return this.orderSort == `new` ? new Date(b.timestamp) - new Date(a.timestamp) : new Date(a.timestamp) - new Date(b.timestamp) });
                    
                    break;
                default:
                    break;
            }
            this.setInternalId(this.emails_filtered);
            // console.log(this.emails);
        },
        setInternalId(obj){
            let i = 0;
            obj.forEach(el => {
                el._id = i;
                i++;
                if(el.selected == undefined){
                    el.selected = false;
                }
            });
        },
        filter(){
            // console.log(`filter`, this.filterBy);
            if(this.filterBy?.length > 0){
                this.emails_filtered = this.emails.filter(el => el.email.includes(this.filterBy));
                this.sort()
            }else{
                this.emails_filtered = this.emails;
                this.sort()
            }
        },
        filterByDomain(domain){
            this.filterBy = `@${domain}`;
            this.filter();
        },
        changePage(){
            // console.log(`page`, this.perPage, this.cPage);

        },
        isVisible(id){
            let visible = false,
                offset = this.perPage * (this.cPage - 1);

            if(id >= offset && id < offset + parseInt(this.perPage)) visible = true;

            // console.log(`isVisible`, id, this.perPage, this.cPage, visible);

            return visible;
        },
        select(id, value){
            // console.log(id, value);
            let hasChanges = false;

            for(let i= 0; i < this.emails_filtered.length; i++){
                if(this.emails_filtered[i].id == id){
                    if(value){
                        this.emails_filtered[i].selected = value;
                        hasChanges = true;
                    }else{
                        this.emails_filtered[i].selected = !this.emails_filtered[i].selected;
                        hasChanges = true;
                    }
                    break;
                }
            }

            if(hasChanges){
                this.setSelectAll();
            }
        },
        selectAll(){
            for(let i= 0; i < this.emails_filtered.length; i++){
                this.emails_filtered[i].selected = this.$refs.selectAllBtn.checked;
            }
            this.filter();
        },
        setSelectAll(){
            let setTrue = 0;
                setFalse = 0;

            for(let i= 0; i < this.emails_filtered.length; i++){
                if(this.emails_filtered[i].selected){
                    setTrue++;
                }else{
                    setFalse++;
                }
            }

            // console.log(`setSelectAll`, setTrue, setFalse);

            if(setTrue == 0){
                this.$refs.selectAllBtn.indeterminate = false;
                this.$refs.selectAllBtn.checked = false;
            }else if(setFalse == 0){
                this.$refs.selectAllBtn.indeterminate = false;
                this.$refs.selectAllBtn.checked = true;
            }else{
                this.$refs.selectAllBtn.indeterminate = true;
            }
            
        },
        async deleteEntry(){
            let toDelete = [];

            this.emails_filtered.filter(el => el.selected).forEach(el => {
                toDelete.push(el.id);
            });

            if(toDelete.length > 0){
                if(confirm("Are you sure you want to delete this?")){
                    let bodyFormData = new FormData();
                    bodyFormData.append('id', JSON.stringify(toDelete));
        
                    axios({
                        method: "post",
                        url: "./api/delete.php",
                        data: bodyFormData,
                        headers: { "Content-Type": "multipart/form-data" },
                    })
                    .then(response =>{
                        let data = response.data;
        
                        if(data.ok){
                            this.getEmails();
                        }else if(data.error){
                            console.log(data.error);
                        }
                    })
                }
            }
        },
        exportEntry(){
            let toExport = this.emails_filtered.filter(el => el.selected);

            if(toExport.length > 0){
                let csv = this.convertToCSV(toExport, [`id`, `email`, `timestamp`], `data:text/csv;charset=utf-8,`);

                let encodedUri = encodeURI(csv),
                    link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "data.csv");
                document.body.appendChild(link);

                link.click();
                link.remove();
            }
        },
        convertToCSV(arr, keys, str = ``) {
            str += `${keys.join()}\n`;
            arr.forEach(el => {
                let obj = [];
                keys.forEach(key => {
                    obj.push(el[key])
                });
                str += `${obj.join()}\n`;
            });

            return str;
        }
    }
}); 