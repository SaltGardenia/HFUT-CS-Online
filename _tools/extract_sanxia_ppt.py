# 软件测试 9 份老 .ppt 经 PowerPoint COM 提取文本
import win32com.client, os, glob

app = win32com.client.Dispatch('PowerPoint.Application')
out_dir = os.path.abspath('_audit/sanxia_extract')
files = sorted(glob.glob('data/大三下/软件测试/课件/PPT/*.ppt'))
for f in files:
    pres = app.Presentations.Open(os.path.abspath(f), WithWindow=False)
    lines = [f'===== {os.path.basename(f)} | {pres.Slides.Count} 页 =====', '']
    for i in range(1, pres.Slides.Count + 1):
        slide = pres.Slides(i)
        lines.append(f'--- slide{i} ---')
        for shape in slide.Shapes:
            if shape.HasTextFrame:
                try:
                    t = shape.TextFrame.TextRange().Text
                    if t.strip():
                        lines.extend(t.replace(chr(11), '\n').split('\n'))
                except Exception:
                    pass
        lines.append('')
    name = os.path.basename(f).replace('.ppt', '')
    open(os.path.join(out_dir, f'软件测试__课件__PPT__{name}.txt'), 'w', encoding='utf-8').write('\n'.join(lines))
    pres.Close()
    print('OK', name, pres.Slides.Count if False else len(lines))
app.Quit()
