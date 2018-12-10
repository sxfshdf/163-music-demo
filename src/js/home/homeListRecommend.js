{
  let view = {
    el: '.listRecommend',
    init(){
      $el = $(this.el)
    },
    template: `
      <p class="listName">推荐歌单</p>
      <ul class="recommed-list">
        <li class="listItem">
          <a href="./detail.html">
            <div class="picture">
              <div class="mount">
                <span class="fas fa-headphones headphone"></span>
                <span class="number">100.5万</span>
              </div>
              <img src="./img/home/list-cover-1.jpg" alt="">
            </div>
            <p class="itemName">史诗级万评电音评电音评电音</p>
            <p class="itemCreator">柠檬木有枝</p>
          </a>
        </li>
        <li class="listItem">
          <a href="./detail.html">
            <div class="picture">
              <div class="mount">
                <span class="fas fa-headphones headphone"></span>
                <span class="number">230.1万</span>
              </div>
              <img src="./img/home/list-cover-2.jpg" alt="">
            </div>
            <p class="itemName">沉恋在唯美纯音乐</p>
            <p class="itemCreator">爱喝水</p>
          </a>
        </li>
        <li class="listItem">
          <a href="./detail.html">
            <div class="picture">
              <div class="mount">
                <span class="fas fa-headphones headphone"></span>
                <span class="number">123.6万</span>
              </div>
              <img src="./img/home/list-cover-4.jpg" alt="">
            </div>
            <p class="itemName">陷阱说唱的低音冲击</p>
            <p class="itemCreator">残梦新城</p>
          </a>
        </li>
        <li class="listItem">
          <a href="./detail.html">
            <div class="picture">
              <div class="mount">
                <span class="fas fa-headphones headphone"></span>
                <span class="number">1002万</span>
              </div>
              <img src="./img/home/list-cover-5.jpg" alt="">
            </div>
            <p class="itemName">总有一首歌冲击你的心</p>
            <p class="itemCreator">Hu-Yung</p>
          </a>
        </li>
        <li class="listItem">
          <a href="./detail.html">
            <div class="picture">
              <div class="mount">
                <span class="fas fa-headphones headphone"></span>
                <span class="number">103.1万</span>
              </div>
              <img src="./img/home/list-cover-7.jpg" alt="">
            </div>
            <p class="itemName">好听到爆的英文歌曲</p>
            <p class="itemCreator">可可落落</p>
          </a>
        </li>
        <li class="listItem">
          <a href="./detail.html">
            <div class="picture">
              <div class="mount">
                <span class="fas fa-headphones headphone"></span>
                <span class="number">84.6万</span>
              </div>
              <img src="./img/home/list-cover-3.jpg" alt="">
            </div>
            <p class="itemName">千山暮雪，只影向谁去</p>
            <p class="itemCreator">鹿白川</p>
          </a>
        </li>
      </ul>
    `,
    render(){
      $(this.el).html(this.template)
    },
    show(){
      $(this.el).parent().addClass('active')
    },
    hide(){
      $(this.el).parent().removeClass('active')
    }
  }

  let model = {}

  let controller = {
    init(view,model){
      this.model = model
      this.view = view
      this.view.init()
      this.view.render(this.model.data)
      this.bindEventHub()
      this.bindEvents()
    },
    bindEventHub(){
      window.eventHub.on('selectTab',(tabName)=>{
        if(tabName === 'page-recommend'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })
    },
    bindEvents(){}
  }

  controller.init(view,model)
}