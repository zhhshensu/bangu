# backend 后端 fastApi 接口

## 关于使用 coqui-ai-TTS 的包替代 TTS 包

原 TTS 包：https://github.com/coqui-ai/TTS
fork 包：https://github.com/idiap/coqui-ai-TTS
TTS 包的作者已经停止维护，且有许多报错，在 github 上找到个 fork 的项目。使用 https://github.com/idiap/coqui-ai-TTS 替代

## 关于 TTS 包的安装

遇到这样的报错, 本地 python 版本过高

```
   File "<string>", line 36, in <module>
      RuntimeError: TTS requires python >= 3.9 and < 3.12 but your Python version is 3.13.2 | packaged by Anaconda, Inc. | (main, Feb
      6 2025, 12:55:35) [Clang 14.0.6 ]

```

使用范围内的版本，安装 TTS 包

```bash
python3.10 -m uv pip add TTS
```
