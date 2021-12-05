let title,
    email,
    emailError,
    tosCheck,
    emailSentSuccess = false;

let errors = {
    "invalidEmail": "Please provide a valid e-mail address",
    "noCkeckbox": "You must accept the terms and conditions",
    "noEmail": "Email address is required",
    "emailEndsWithCo": "We are not accepting subscriptions from Colombia emails",
    "serverError": "Oops! Something went wrong. Please try again later",
}

let app = new Vue({ 
    el: "#app", 

    data() {
        return {
            title: "Magebit test",
            email,
            emailError,
            // tosCheck,
            emailSentSuccess,
        };
    },

    mounted(){
        // console.log("vue mounted");
    },

    methods:{
        async validate(){
            // console.log(this.email);
            let address = this.email;
            // console.log(`empty`, !this.strEmpty(address));
            // console.log(`regex`, !!!this.validateEmail(address));
            // console.log(`chekbox`, !this.$refs.tosCheck.checked);

            emailSentSuccess = false;

            if(!address || !this.strEmpty(address)){
                this.emailError = errors.noEmail;
                return;
            }else if(!!!this.validateEmail(address)){
                this.emailError = errors.invalidEmail;
                return;
            }else if(address.endsWith(`.co`)){
                this.emailError = errors.emailEndsWithCo;
                return;
            }else if(!this.$refs.tosCheck.checked){
                this.emailError = errors.noCkeckbox;
                return;
            }else{
                this.emailError = '';
                this.sendEmail();
            }
        },
        strEmpty(str){
            if(typeof str == `string`) str = str.trim();
            return !!str;
        },
        validateEmail(email){
            if(!email) return;
            return email
                .toLowerCase()
                .match(
                    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
                );
        },
        async sendEmail(){
            let bodyFormData = new FormData();
            bodyFormData.append('email', this.email);
            bodyFormData.append('tos', this.$refs.tosCheck.checked);

            axios({
                method: "post",
                url: "./api/subscribe.php",
                data: bodyFormData,
                headers: { "Content-Type": "multipart/form-data" },
            })
            .then(response =>{
                let data = response.data;

                if(data.ok){
                    this.emailError = '';
                    this.emailSentSuccess = true;
                }else if(data.error){
                    this.emailSentSuccess = false;
                    this.emailError = data.error;
                }else{
                    this.emailSentSuccess = false;
                    this.emailError = error.serverError;
                }
            })
            .catch(function (error) {
                console.log(error);
                this.emailSentSuccess = false;
                this.emailError = error.serverError;
            });
        }
    }
}); 