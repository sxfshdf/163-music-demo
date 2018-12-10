{
  let view = {
    el: '.hotSearchContainer',
    init(){
      $el = $(this.el)
    },
    template: `
      <p class="hotSearch">热门搜索:</p>
      <ul class="searchTabs">
        <li>空白世界</li>
        <li>天后</li>
        <li>哈哈哈</li>
      </ul>
    `,
    render(){
      $el.html(this.template)
    },
    show(){
      $el.addClass('active')
    },
    hide(){
      $el.removeClass('active')
    }
  }

  let model = {}

  let controller = {
    init(view,model){
      console.log(11)
      this.view = view
      this.view.init()
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents(){},
    bindEventHub(){}
  }

  controller.init(view,model)
}