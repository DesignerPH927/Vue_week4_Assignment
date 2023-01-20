
import pagination from './pagination.js';


const app = Vue.createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'zack_p',
      productModal: '',    // 產品modal
      deleteProductModal: '', // 刪除產品modal
      products: [], // 遠端資料
      isNew: false, // 判別新、舊資料
      tempProduct: {  // 編輯新、舊資料
        imagesUrl: [],
      },
      page: {}, // 建立分頁資料
    }
  },
  components: {
    pagination,
  },
  methods: {
    // 登入時必須先檢查是否正常登入
    checkAdmin() {
      axios.post(`${this.apiUrl}/api/user/check`)
        .then((res) => {
          Swal.fire({
            icon: 'success',
            title: '登入成功',
          });
          // alert('驗證成功', res.data.success);
          this.getProducts();
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = "index.html";
        })
    },
    // 登入驗證成功就可取得產品列表
    getProducts( page = 1 ) { // pages = 1 為預設參數
      axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`)
        .then((res) => {   
          // console.log(res.data.products);       
          this.products = res.data.products;
          // 必須把分頁資料存入設定的pages中
          this.page = res.data.pagination;
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    // 由於modal新舊資料共用，故必須判斷才可個別開啟
    openModal(isNew, item) {
      // console.log(isNew,item);
      if (isNew === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        }
        this.isNew = true;
        this.productModal.show();
      }else if(isNew === 'edit') {
        this.tempProduct = {...item};
        this.isNew = false;
        this.productModal.show();
      }else if (isNew === 'delete') {
        this.tempProduct = {...item};
        this.deleteProductModal.show();
      }
    },
    // 新增、編輯資料
    updateProduct() {
      // 宣告新增資料的API，由於url會變動故使用let做宣告
      // 宣告 axios用的方法，由於http也是會變動故使用let做宣告
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let http = 'post';
      // 判斷是否新增或編輯
      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put';
      }
      axios[http](url, { data: this.tempProduct })
        .then(() => {
          this.productModal.hide();
          this.getProducts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    removeProduct() {
      // 宣告移除的API，由於此API是固定的，故可用const宣告
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      axios.delete(url)
        .then((res) => {
          Swal.fire({
            title: '產品已經刪除囉!!',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          })
          // alert(res.data.message);
          this.deleteProductModal.hide();
          this.getProducts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    }
  },
  mounted() {
    // 產品頁面必須取出token並存入headers中，才可正確取得產品列表
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)zack0117\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;
    this.checkAdmin();

    // 開啟Bootstrap Modal
    this.productModal = new bootstrap.Modal(this.$refs.pModal, {
      keyboard: false
    });
    this.deleteProductModal = new bootstrap.Modal(this.$refs.delModal, {
      keyboard: false
    });
  },
});

app.component('product-modal',{
  props: ['tempProduct','updateProduct','isNew'],
  template: '#product-modal-template',
})


app.mount('#app'); 