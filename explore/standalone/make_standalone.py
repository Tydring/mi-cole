import re, base64, os, sys
MIME={'.svg':'image/svg+xml','.woff2':'font/woff2','.ttf':'font/ttf','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.mp4':'video/mp4'}
def inline(path, out):
    d=os.path.dirname(os.path.abspath(path)); s=open(path).read()
    def rep(m):
        ref=m.group(2)
        if ref.startswith(('http','data:','mailto:','#')): return m.group(0)
        f=os.path.normpath(os.path.join(d,ref.split('?')[0]))
        if not os.path.exists(f): return m.group(0)
        b=base64.b64encode(open(f,'rb').read()).decode()
        return m.group(1)+f"data:{MIME[os.path.splitext(f)[1]]};base64,{b}"+m.group(3)
    s=re.sub(r'(src=")([^"]+)(")',rep,s)
    s=re.sub(r'(srcset=")([^"]+)(")',rep,s)
    s=re.sub(r'(url\(")([^"]+)("\))',rep,s)
    # the video intro builds its src in script: inline both formats
    if "micole-sting-'+" in s:
        v916=base64.b64encode(open(os.path.join(d,'../brand/video/micole-sting-9x16.mp4'),'rb').read()).decode()
        v169=base64.b64encode(open(os.path.join(d,'../brand/video/micole-sting-16x9.mp4'),'rb').read()).decode()
        s=s.replace("v.src='../brand/video/micole-sting-'+(innerHeight>innerWidth?'9x16':'16x9')+'.mp4';",
                    f"v.src=(innerHeight>innerWidth?'data:video/mp4;base64,{v916}':'data:video/mp4;base64,{v169}');")
    open(out,'w').write(s); print(out, round(len(s)/1024),'KB')
for f in sys.argv[1:]:
    inline(f, os.path.join('standalone', os.path.basename(f)))
