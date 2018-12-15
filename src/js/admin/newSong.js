{
  let view = {
    el: '.newSong',
    template: `
      <form>
        <div class="raw">
          <label for="name">歌名</label>
          <input type="text" id="name" name="name" value="__name__">
        </div>
        <div class="raw">
          <label for="singer">歌手</label>
          <input type="text" id="singer" name="singer" value="__singer__">
        </div>
        <div class="raw">
          <label for="url">外链</label>
          <input type="text" id="url" name="url" value="__url__">
        </div>
        <div class="raw">
          <label for="cover">封面</label>
          <input type="text" id="cover" name="cover" value="__cover__">
        </div>
        <div class="raw">
          <label class="lyric" for="lyric">歌词</label>
          <textarea rows="5" id="lyric" name="lyric">__lyric__</textarea>
        </div>
        <div class="raw actions">
          <button class="save" type="sumit">保存</button>
          <button id="cancel" class="cancel" type="button">取消</button>
        </div>
      </form>
    `,
    render(data = {}) {
      let placeHolder = ['name', 'url', 'singer','cover','lyric']
      let html = this.template
      placeHolder.map((string) => {
        html = html.replace(`__${string}__`, data[string] || '')
      })
      $(this.el).html(html)

    },
    showNewSong() {
      $(this.el).css('display', 'block')
    },
    hideNewSong() {
      $(this.el).css('display', 'none')
    }
  }

  let model = {
    data: {},
    create(data) {
      // 声明类型
      var Song = AV.Object.extend('Song')
      // 新建对象
      var song = new Song()
      // 设置名称
      song.set('name', data.name)
      song.set('singer', data.singer)
      song.set('url', data.url)
      song.set('cover', data.cover)
      song.set('lyric', data.lyric)
      return song.save().then((newSong) => {
        let { id, attributes } = newSong
        let createDate = newSong.createdAt.toLocaleDateString()
        let createHours = time(newSong.createdAt.getHours())
        let createMinutes = time(newSong.createdAt.getMinutes())
        let createSeconds = time(newSong.createdAt.getSeconds())

        let updateDate = newSong.updatedAt.toLocaleDateString()
        let updateHours = time(newSong.updatedAt.getHours())
        let updateMinutes = time(newSong.updatedAt.getMinutes())
        let updateSeconds = time(newSong.updatedAt.getSeconds())
        function time(time) {
          if (time < 10) {
            time = '0' + time
          }
          return time
        }
        let createTime = createDate + ' ' + createHours + ':' + createMinutes + ':' + createSeconds
        let updateTime = updateDate + ' ' + updateHours + ':' + updateMinutes + ':' + updateSeconds
        this.data.createTime = createTime
        this.data.updateTime = updateTime
        Object.assign(this.data, { id, ...attributes })
      }, (error) => {
        console.error(error);
      })
    },
    update(data) {
      let song = AV.Object.createWithoutData('Song', this.data.id);
      // 修改属性
      song.set('name', data.name)
      song.set('singer', data.singer)
      song.set('url', data.url)
      song.set('cover', data.cover)
      song.set('lyric', data.lyric)
      return song.save().then((newSong) => {
        let { id, attributes } = newSong

        let updateDate = newSong.updatedAt.toLocaleDateString()
        let updateHours = time(newSong.updatedAt.getHours())
        let updateMinutes = time(newSong.updatedAt.getMinutes())
        let updateSeconds = time(newSong.updatedAt.getSeconds())
        function time(time) {
          if (time < 10) {
            time = '0' + time
          }
          return time
        }
        let updateTime = updateDate + ' ' + updateHours + ':' + updateMinutes + ':' + updateSeconds
        this.data.updateTime = updateTime
        Object.assign(this.data, { id, ...attributes })
      }, (error) => {
        console.error(error);
      })
    }
  }

  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()

      window.eventHub.on('upload', (data) => {
        this.model.data = data
        this.view.showNewSong()
        this.view.render(this.model.data)
      })

      window.eventHub.on('cancel', () => {
        this.view.hideNewSong()
      })

      window.eventHub.on('create', (data) => {
        this.view.hideNewSong()
      })

      window.eventHub.on('edit', (data) => {
        this.view.showNewSong()
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('update',(data)=>{
        this.view.hideNewSong()
      })
    },

    bindEvents() {
      let $el = $(this.view.el)
      $el.on('click', '#cancel', (e) => {
        e.preventDefault()
        window.eventHub.emit('cancel')
      })

      $el.on('submit', 'form', (e) => {
        e.preventDefault()
        if (this.model.data.id) {
          let need = 'name singer url cover lyric'.split(' ')
          let data = {}
          need.map((string) => {
            data[string] = $el.find(`[name=${string}]`).val()
          })
          this.model.update(data)
          .then((data)=>{
            window.eventHub.emit('update',this.model.data)
          })
        } else {
          let need = 'name singer url cover lyric'.split(' ')
          let data = {}
          need.map((string) => {
            data[string] = $el.find(`[name=${string}]`).val()
          })
          this.model.create(data)
            .then(() => {
              window.eventHub.emit('create', JSON.parse(JSON.stringify(this.model.data)))
            })
        }
      })
    }


  }

  controller.init(view, model)
}