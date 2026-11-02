"""LUT 3D HLG BT.2020 -> SDR BT.709 (BT.2100 + OOTF 1,2, blanc de référence 203 nits, BT.2408).
Usage : python3 lut.py sortie.cube [gain] [genou] [gamma_ecran]"""
import math,sys
out=sys.argv[1]; G=float(sys.argv[2]) if len(sys.argv)>2 else 1.0; K=float(sys.argv[3]) if len(sys.argv)>3 else .75; GE=float(sys.argv[4]) if len(sys.argv)>4 else 2.4
a,b,c=.17883277,.28466892,.55991073
def inv(e): return e*e/3 if e<=.5 else (math.exp((e-c)/a)+b)/12
M=[(1.6605,-.5876,-.0728),(-.1246,1.1329,-.0083),(-.0182,-.1006,1.1187)]
PIC=1000/203*G
def rolloff(x):
    if x<=K: return x
    r=1-K
    # asymptote 1, atteinte en PIC
    return K+r*(1-math.exp(-(x-K)/r))/(1-math.exp(-(PIC-K)/r))
def f(R,G_,B):
    E=[inv(v) for v in (R,G_,B)]
    Y=.2627*E[0]+.678*E[1]+.0593*E[2]
    o=max(Y,1e-6)**.2
    L=[e*o*1000/203*G for e in E]
    l=[max(0,sum(m*v for m,v in zip(row,L))) for row in M]
    mx=max(l)
    if mx>K:
        t=rolloff(mx)/mx
        l=[v*t for v in l]
    return [min(1,v)**(1/GE) for v in l]
N=65
with open(out,'w') as w:
    w.write(f'LUT_3D_SIZE {N}\n')
    for bi in range(N):
        for gi in range(N):
            for ri in range(N):
                w.write('%.5f %.5f %.5f\n'%tuple(f(ri/(N-1),gi/(N-1),bi/(N-1))))
