{
  let view = {
    el: '.home',
    init() {
      this.$el = $(this.el)
    },
    template: `
      <div class="wrapper">
        <div class="list"></div>
        <div class="songs"></div>
      </div>
    `,
    // renderSongs(data) {
    //   this.$el.html(this.template)
    //   let { songs } = data
    //   let tdDoms = songs.map((song)=>{
    //     return `<tr>
    //     <td class="name">${song.name}</td>
    //     <td class="singer">${song.singer}</td>
    //     <td class="createTime">${song.createTime}</td>
    //     <td class="updateTime">${song.updateTime}</td>
    //   </tr>`
    //   })
    //   this.$el.find('tbody').empty()
    //   tdDoms.map((tdDom)=>{
    //     this.$el.find('tbody').append(tdDom)
    //   })
    // },
    render(data){
      this.$el.html(this.template)
    },
    show() {
      this.$el.css('display', 'block')
    },
    hide() {
      this.$el.css('display', 'none')
    }
  }

  let model = {}

  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents() {},
    bindEventHub() {
      window.eventHub.on('selectTab', (tabName) => {
        if (tabName === 'home') {
          this.view.show()
          $(this.view.el).siblings().css('display','none').siblings('header').css('display','block')
        } else {
          this.view.hide()
        }
      })
      window.eventHub.on('upload',()=>{
        this.view.hide()
      })
      window.eventHub.on('homeToDetail',()=>{
        this.view.hide()
      })
    }
  }

  controller.init(view, model)
}