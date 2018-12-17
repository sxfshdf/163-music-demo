{
  let view = {
    el: '.listRecommend',
    init(){
      this.$el = $(this.el)
    },
    template: `
      <p class="listName">推荐歌单</p>
      <ul class="recommed-list">
      </ul>
    `,
    render(data){
      this.$el.html(this.template)
      let { playlists } = data
      playlists.map((list)=>{
        let $li = $(`
        <li class="listItem">
        <a href="./detail.html?id=${list.id}">
          <div class="picture">
            <div class="mount">
              <span class="fas fa-headphones headphone"></span>
              <span class="number">100.5万</span>
            </div>
            <img src="${list.cover}" alt="">
          </div>
          <p class="itemName">${list.name}</p>
          <p class="itemCreator">Admin</p>
        </a>
      </li>
        `)
        this.$el.find('ul.recommed-list').append($li)
      })
    },
    show(){
      this.$el.parent().addClass('active')
    },
    hide(){
      this.$el.parent().removeClass('active')
    }
  }

  let model = {
    data: {
      playlists:[]
    },
    find(){
      let query = new AV.Query('Playlist')
      query.descending('updatedAt')
      query.limit(6)
      return query.find().then((playlists) => {
        this.data.playlists = playlists.map((list) => {
          return Object.assign({id: list.id}, list.attributes)
        })
        return playlists
      })
    }
  }

  let controller = {
    init(view,model){
      this.model = model
      this.view = view
      this.view.init()
      this.model.find().then(()=>{
        this.view.render(this.model.data)
      })
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