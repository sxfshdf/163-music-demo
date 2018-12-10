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
      // $el form.search-container
      $el.siblings('.hotSearchContainer').addClass('active')
    },
    hide(){
      // $el form.search-container
      $el.siblings('.hotSearchContainer').removeClass('active')
    }
  }

  let model = {}

  let controller = {
    init(view,model){
      this.view = view
      this.view.init()
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents(){
      $el.on('click','li',(e)=>{
        let value = $(e.currentTarget).text()
        window.eventHub.emit('selectSearchTab',value)
      })
    },
    bindEventHub(){
      window.eventHub.on('search',(data)=>{
        let className = $el.siblings('.hotSearchContainer').attr('class')
        // $el form.search-container
        this.view.hide()
      })
      window.eventHub.on('resetSearch',()=>{
        this.view.show()
      })
      window.eventHub.on('noSearchValue',()=>{
        this.view.show()
      })
      window.eventHub.on('selectSearchTab',(value)=>{
        this.view.hide()
      })
    }
  }

  controller.init(view,model)
}