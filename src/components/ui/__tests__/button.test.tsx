import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../button'
import { Play } from 'lucide-react'

describe('Button 组件', () => {
  it('应该渲染基本按钮', () => {
    render(<Button>点击我</Button>)
    expect(screen.getByRole('button', { name: '点击我' })).toBeInTheDocument()
  })

  it('应该处理点击事件', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>点击我</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('应该显示加载状态', () => {
    render(<Button loading>加载中</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('应该渲染图标', () => {
    render(<Button icon={Play}>播放</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('应该应用正确的变体样式', () => {
    render(<Button variant="primary">主要按钮</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-600')
  })

  it('应该支持全宽度', () => {
    render(<Button fullWidth>全宽按钮</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('w-full')
  })

  it('应该在禁用时不响应点击', () => {
    const handleClick = jest.fn()
    render(<Button disabled onClick={handleClick}>禁用按钮</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})

describe('AudioButton 组件', () => {
  it('应该渲染音频按钮', () => {
    const { AudioButton } = require('../button')
    render(<AudioButton />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('应该在播放时显示动画', () => {
    const { AudioButton } = require('../button')
    render(<AudioButton isPlaying />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('animate-pulse')
  })
})
