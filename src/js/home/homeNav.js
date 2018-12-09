{
  let view = {
    el: '.nav',
    template: `
      <ul>
        <li data-tabName="page-recommend" class="recommend active">推荐音乐</li>
        <li data-tabName="page-hotSong" class="hot">热歌榜</li>
        <li data-tabName="page-search" class="search">搜索</li>
      </ul>
    `,
    render(){
      $(this.el).html(this.template)
    }
  }

  let model = {}

  let controller = {
    init(view,model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventhub()
    },
    bindEvents(){
      $(this.view.el).on('click','li',(e)=>{
        let $e = $(e.currentTarget)
        $e.addClass('active').siblings('.active').removeClass('active')
        let tabName = $e.attr('data-tabName')
        window.eventHub.emit('selectTab',tabName)
      })
    },
    bindEventhub(){}
  }

  controller.init(view,model)
}