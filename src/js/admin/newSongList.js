{
  let view = {
    el: '.newSongList',
    template: `
      <form>
        <div class="raw">
          <label for="name">歌单名称</label>
          <input type="text" id="name" name="name" value="__name__">
        </div>
        <div class="raw">
          <label for="cover">歌单封面</label>
          <input type="text" id="cover" name="cover" value="__cover__">
        </div>
        <div class="raw">
          <label class="description" for="description">歌单简介</label>
          <textarea rows="8" id="description" name="description">__description__</textarea>
        </div>
        <div class="raw actions">
          <button class="save" type="sumit">保存</button>
          <button id="cancel" class="cancel" type="button">取消</button>
        </div>
      </form>
    `,
    render(data = {}) {
      let placeHolder = 'name cover description'.split(' ')
      let html = this.template
      placeHolder.map((string) => {
        html = html.replace(`__${string}__`, data[string] || '')
      })
      $(this.el).html(html)
    },
    show() {
      $(this.el).css('display', 'block')
    },
    hide() {
      $(this.el).css('display', 'none')
    }
  }

  let model = {
    data: {},
    create(data) {
      // 声明类型
      var Playlist = AV.Object.extend('Playlist')
      // 新建对象
      var playlist = new Playlist()
      // 设置名称
      playlist.set('name', data.name)
      playlist.set('cover', data.cover)
      playlist.set('description', data.description)
      return playlist.save().then((list) => {
        let { id, attributes } = list
        let createDate = list.createdAt.toLocaleDateString()
        let createHours = time(list.createdAt.getHours())
        let createMinutes = time(list.createdAt.getMinutes())
        let createSeconds = time(list.createdAt.getSeconds())

        let updateDate = list.updatedAt.toLocaleDateString()
        let updateHours = time(list.updatedAt.getHours())
        let updateMinutes = time(list.updatedAt.getMinutes())
        let updateSeconds = time(list.updatedAt.getSeconds())
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
      })
    },
    update(data) {
      let playlist = AV.Object.createWithoutData('Playlist', this.data.id);
      // 修改属性
      playlist.set('name', data.name)
      playlist.set('cover', data.cover)
      playlist.set('description', data.description)
      return playlist.save().then((newList) => {
        let { id, attributes } = newList

        let updateDate = newList.updatedAt.toLocaleDateString()
        let updateHours = time(newList.updatedAt.getHours())
        let updateMinutes = time(newList.updatedAt.getMinutes())
        let updateSeconds = time(newList.updatedAt.getSeconds())
        function time(time) {
          if (time < 10) {
            time = '0' + time
          }
          return time
        }
        let updateTime = updateDate + ' ' + updateHours + ':' + updateMinutes + ':' + updateSeconds
        this.data.updateTime = updateTime
        Object.assign(this.data, { id, ...attributes })
      })
    }
  }

  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      this.bindEventHub()
    },
    bindEvents() {
      $(this.view.el).on('submit', 'form', (e) => {
        e.preventDefault()
        if (this.model.data.id) {
          let need = 'name cover description'.split(' ')
          let data = {}
          need.map((string) => {
            let value = $(this.view.el).find(`[name = ${string}]`).val().trim()
            data[string] = value
          })
          if (data.songListName === '') {
            alert('请输入歌单名称')
            $(this.view.el).find('[name = name]').focus()
            return
          } else if (data.songListCover === '') {
            alert('请添加歌单封面')
            $(this.view.el).find('[name = cover]').focus()
            return
          } else if (data.listDescription === '') {
            alert('请输入歌单简介')
            $(this.view.el).find('[name = description]').focus()
            return
          } else {
            this.model.update(data).then(() => {
              window.eventHub.emit('updatePlaylist', this.model.data)
            })
          }
        } else {
          let need = 'name cover description'.split(' ')
          let data = {}
          need.map((string) => {
            let value = $(this.view.el).find(`[name = ${string}]`).val().trim()
            data[string] = value
          })
          if (data.songListName === '') {
            alert('请输入歌单名称')
            $(this.view.el).find('[name = name]').focus()
            return
          } else if (data.songListCover === '') {
            alert('请添加歌单封面')
            $(this.view.el).find('[name = cover]').focus()
            return
          } else if (data.listDescription === '') {
            alert('请输入歌单简介')
            $(this.view.el).find('[name = description]').focus()
            return
          } else {
            this.model.create(data).then(() => {
              window.eventHub.emit('createPlaylist', JSON.parse(JSON.stringify(this.model.data)))
            })
          }
        }

      })
      $(this.view.el).on('click', '.cancel', (e) => {
        window.eventHub.emit('createListCancel')
      })
    },
    bindEventHub() {
      window.eventHub.on('createList', () => {
        this.view.show()
        this.model.data = {}
        this.view.render(this.model.data)
      })
      window.eventHub.on('createPlaylist', (data) => {
        this.view.hide()
      })
      window.eventHub.on('createListCancel', () => {
        this.view.hide()
      })
      window.eventHub.on('editList', (data) => {
        this.view.show()
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('updatePlaylist',()=>{
        this.view.hide()
      })
    },

  }

  controller.init(view, model)
}