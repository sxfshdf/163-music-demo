{
  let view = {
    el: '.home',
    init() {
      this.$el = $(this.el)
    },
    template: `
    <div class="wrapper">
      <div class="list">
        <div class="homeListHeadWrapper">
           <h4 class="listTitle">最新歌单</h4>
        </div>
        <ul>
          <li>
            <div class="listCover">
              <img src="./img/home/list-cover-1.jpg" alt="">
            </div>
            <div class="listInfo">
              <p class="listName">我是歌单名称哈哈哈</p>
              <p class="listCreator">我是创建者</p>
            </div>
          </li>
          <li>
            <div class="listCover">
              <img src="./img/home/list-cover-1.jpg" alt="">
            </div>
            <div class="listInfo">
              <p class="listName">我是歌单名称哈哈哈</p>
              <p class="listCreator">我是创建者</p>
            </div>
          </li>
          <li>
            <div class="listCover">
              <img src="./img/home/list-cover-1.jpg" alt="">
            </div>
            <div class="listInfo">
              <p class="listName">我是歌单名称哈哈哈</p>
              <p class="listCreator">我是创建者</p>
            </div>
          </li>
          <li>
            <div class="listCover">
              <img src="./img/home/list-cover-1.jpg" alt="">
            </div>
            <div class="listInfo">
              <p class="listName">我是歌单名称哈哈哈</p>
              <p class="listCreator">我是创建者</p>
            </div>
          </li>
          <li>
            <div class="listCover">
              <img src="./img/home/list-cover-1.jpg" alt="">
            </div>
            <div class="listInfo">
              <p class="listName">我是歌单名称哈哈哈</p>
              <p class="listCreator">我是创建者</p>
            </div>
          </li>
          <li>
            <div class="listCover">
              <img src="./img/home/list-cover-1.jpg" alt="">
            </div>
            <div class="listInfo">
              <p class="listName">我是歌单名称哈哈哈</p>
              <p class="listCreator">我是创建者</p>
            </div>
          </li>
          <li>
            <div class="listCover">
              <img src="./img/home/list-cover-1.jpg" alt="">
            </div>
            <div class="listInfo">
              <p class="listName">我是歌单名称哈哈哈</p>
              <p class="listCreator">我是创建者</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="songs">
        <h4 class="songsTitle">最新歌曲</h4>
        <div class="tableContainer">
          <table>
            <thead>
              <tr>
                <th class="name">歌名</th>
                <th class="singer">歌手</th>
                <th class="createTime">创建时间</th>
                <th class="updateTime">更新时间</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="name">天后天后天后天</td>
                <td class="singer">陈势安陈</td>
                <td class="createTime">2018/12/5 下午10:57:23</td>
                <td class="updateTime">2018/12/5 下午10:57:23</td>
               
              </tr>
              <tr>
                <td class="name">天后天后天后天</td>
                <td class="singer">陈势安陈</td>
                <td class="createTime">2018/12/5 下午10:57:23</td>
                <td class="updateTime">2018/12/5 下午10:57:23</td>
               
                
              </tr>
              <tr>
                <td class="name">天后天后天后天</td>
                <td class="singer">陈势安陈</td>
                <td class="createTime">2018/12/5 下午10:57:23</td>
                <td class="updateTime">2018/12/5 下午10:57:23</td>
                
              </tr>
              <tr>
                <td class="name">天后天后天后天</td>
                <td class="singer">陈势安陈</td>
                <td class="createTime">2018/12/5 下午10:57:23</td>
                <td class="updateTime">2018/12/5 下午10:57:23</td>
                
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
    `,
    render() {
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
      this.view.render()
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

    }
  }

  controller.init(view, model)
}