import AboutRaw from './AboutRaw'
import AppTitle from '../../components/AppTitle'
import NavBar from '../../components/NavBar'

import './index.scss'
import { For } from 'solid-js'

interface rawInfo {
  label: string
  text: string
  url?: string
}

const aboutList: rawInfo[] = [
  {
    label: '开发者',
    text: '凌天akex'
  },
  {
    label: 'Email',
    text: '2844520415@qq.com'
  },
  {
    label: 'Github',
    text: 'https://github.com/akex4396'
  },
  {
    label: '项目地址',
    text: '点击查看',
    url: 'https://github.com/akex4396/Reader-Solidjs'
  },
  {
    label: '开源协议',
    text: 'MIT',
    url: 'https://github.com/akex4396/Reader-Solidjs/blob/master/License'
  },
  {
    label: '开发框架',
    text: 'SolidJs'
  },
  {
    label: '当前版本',
    text: 'beta-0.0.1'
  }
]

export default function () {
  const setTheme = (theme: string) => {
    if (theme == 'dark') {
      document.documentElement.setAttribute('theme-dark', '')
    } else {
      document.documentElement.removeAttribute('theme-dark')
    }
  }

  return (
    <div id='about'>
      <AppTitle text={'关于'} />
      <main>
        {/* 软件的详细信息 */}
        <For each={aboutList}>{item => <AboutRaw text={item.text} label={item.label} url={item.url} />}</For>

        {/* 主题设置 */}
        <div class='theme-setting text-center'>
          <div class='theme-title'>
            <strong>主题</strong>
          </div>
          <div class='theme-btn '>
            <button class='bg-primary text-dark' onclick={[setTheme, 'dark']}>
              夜雨寄北
            </button>
            <button class='bg-primary text-white' onclick={[setTheme, '']}>
              白虹贯日
            </button>
          </div>
        </div>
        {/* 主题设置 */}
      </main>
      <NavBar />
    </div>
  )
}
