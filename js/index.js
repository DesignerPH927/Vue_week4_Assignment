

const app = Vue.createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'zack_p',
      user: {
        username: '',
        password: '',
      }
    }
  },
  methods: {
    // 登入SOP: 1. 登入 2. 取出token、expired 3. 將token、expired存入cookie中
    login() {
      axios.post(`${this.apiUrl}/admin/signin`,this.user)
        .then((res) => {
          // console.log(res.data);
          const { token, expired } = res.data;
          // console.log(token,expired);
          document.cookie = `zack0117=${token}; expires=${new Date(expired)};`;
          window.location = "products.html";
        })
        .catch((err) => {
          // console.log(err);
          alert(err.response.data.message);
        })
    }
  } 
})

app.mount('#app');