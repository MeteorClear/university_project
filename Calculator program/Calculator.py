'''
프로그래밍입문 - 파이썬 프로젝트 - 사칙연산 계산기 -

tkinter 를 이용한 GUI 구현 및 괄호를 포함한 사칙연산 계산기
'''


'''

 ┌────────────────────────┐ ─┐
 │┌──────────────────────┐│  │ ─┐
 ││          Full formula││     │
 ││               Display││     │ 80px
 ││       with small font││     │
 │└──────────────────────┘│    ─┘
 │        Current formula │
 │                Display │
 │        with large font │
 │┌────┐┌────┐┌────┐┌────┐│    ─┐
 ││  ( ││  ) ││ C  ││ bs ││     │ 50px
 │└────┘└────┘└────┘└────┘│    ─┘
 │┌────┐┌────┐┌────┐┌────┐│
 ││  7 ││  8 ││  9 ││  ÷ ││
 │└────┘└────┘└────┘└────┘│  │
 │┌────┐┌────┐┌────┐┌────┐│
 ││  4 ││  5 ││  6 ││  × ││  │ 420px
 │└────┘└────┘└────┘└────┘│
 │┌────┐┌────┐┌────┐┌────┐│  │
 ││  1 ││  2 ││  3 ││  - ││
 │└────┘└────┘└────┘└────┘│    ─┐ 5px
 │┌────┐┌────┐┌────┐┌────┐│    ─┘ 
 ││  . ││  0 ││  = ││  + ││
 │└────┘└────┘└────┘└────┘│  │
 └────────────────────────┘ ─┘
 └─         265px        ─┘
  └────┘           └┘
   60px            5px
  
'''


import tkinter
import re
import sys

temp = 0
display_formula = ""
formula = ""
cnt = 0

Cwin = tkinter.Tk()

Cwin.title("Calculator project")
Cwin.geometry("265x420")                # x = (5+60+5+60+5+60+5+60+5)
Cwin.resizable(False, False)
Cwin.config(bg="#2d2d2d")



def error():
    print("\n\n\n\t\tFATAL ERROR\n\n\n")


def tokenize(expStr):
    pat = re.compile(r'(?:(?<=[^\d\.])(?=\d)|(?=[^\d\.]))', re.MULTILINE)
    return [x for x in re.sub(pat, ' ', expStr).split(' ') if x]


def set_command_value(value):
    global temp
    global display_formula
    global formula
    global cnt

    if not(0 <= value <= 9) :
        error()
        print("\t\t오류 :: 지정되지 않은 숫자!\n\n\n")
    
    temp *= 10
    temp += value
    display_formula += str(value)
    formula += str(value)
    
    cnt += 1
    if cnt > 24 :
        cnt = 0
        display_formula += "\n"

    
    print(display_formula, " /*/ ", temp)
    print()
    print("Current formula : ", formula)
    print()
    print()
    
    m_l1.configure(text=display_formula)
    m_l2.configure(text=temp)


def set_command_operator(operator):
    global temp
    global display_formula
    global formula
    global cnt
    
        
    cnt += 3
    
    if operator == '+' :
        display_formula += " + "
        formula += operator
    elif operator == '-' :
        display_formula += " - "
        formula += operator
    elif operator == '*' :
        display_formula += " × "
        formula += operator
    elif operator == '/' :
        display_formula += " ÷ "
        formula += operator
        
    elif operator == '(' :
        display_formula += "("
        formula += operator
    elif operator == ')' :
        display_formula += ")"
        formula += operator
    elif operator == '.' :
        display_formula += "."
        formula += operator
        
    else :
        error()
        print("\t\t오류 :: 지정되지 않은 연산자!\n\n\n")

    if cnt > 24 :
        cnt = 0
        display_formula += "\n"

    temp = 0
    m_l1.configure(text=display_formula)
    m_l2.configure(text="")

    
def result():
    global display_formula
    global formula
    global temp
    
    temp = 0
    display_formula += " = "
    
    
    if len(sys.argv) > 1 :
        x = ' '.join(sys.argv[1:])
    else:
        x = formula
        
    process(x)        


def process(expStr):
    global display_formula
    global formula

    res = calc_expr(parse_expr(expStr))
    display_formula += str(res)
    
    print("Final formula : ", display_formula)
    print("Result : ",res)
    
    m_l1.configure(text=display_formula)
    m_l2.configure(text=res)

    formula = str(res)
    display_formula = str(res)



def calc_expr(tokens):
    operations = {
            '*': lambda x, y: y * x,
            '/': lambda x, y: y / x,
            '+': lambda x, y: y + x,
            '-': lambda x, y: y - x
            }

    stack = []

    for i in tokens :
        if i not in operations :
            if '.' in i :
                stack.append(float(i))
            else :
                stack.append(int(i))
                
        else :
            x = stack.pop()
            y = stack.pop()
            stack.append(operations[i](x, y))
            
    return stack[-1]


def parse_expr(expStr):
    tokens = tokenize(expStr)
    op = dict(zip('*/+-()', (50, 50, 40, 40, 0, 0)))
    output = []
    stack = []

    for i in tokens :
        if i not in op :
            output.append(i)
            
        elif i == '(' :
                stack.append(i)
                
        elif i == ')' :
            while stack != [] and \
                        stack[-1] != '(':
                output.append(stack.pop())
            stack.pop()
            
        else :
            while stack != [] and \
                    op[stack[-1]] >= op[i]:
                output.append(stack.pop())
            stack.append(i)

    while stack :
        output.append(stack.pop())
        
    print("output : ", output)
    return output


def clear():
    global display_formula
    global formula
    global temp

    display_formula = ""
    formula = ""
    temp = 0

    m_l1.configure(text="")
    m_l2.configure(text=temp)

    print("\n\n\t\t\tCLEAR\n\n")


def backspace():
    global display_formula
    global formula
    global temp

    if temp != 0 :
        temp = temp // 10
        formula = formula[:len(formula)-1]
        display_formula = display_formula[:len(display_formula)-1]

        print("Backspace !")
        print("temp = ", temp)
        print("display_formula = ", display_formula)
        print("Current formula = ", formula)

    else :
        print("temp = 0!, PASS")

    m_l1.configure(text=display_formula)
    m_l2.configure(text=temp)




m_l1 = tkinter.Label(
    Cwin, text="TEST", fg="white",
    bg="#2d2d2d", font=("hack",12), justify="right",
    padx=12, anchor='e', relief="solid"
    )

m_l2 = tkinter.Label(
    Cwin, text="TEST", fg="white",
    bg="#2d2d2d", font=("hack",18), justify="right",
    padx=12, anchor='e',
    )


m_l1.place(x=5, y=5, width=255, height=80)
m_l2.place(x=5, y=90, width=255, height=50)


m_cb0 = tkinter.Button(Cwin,
    text = " 0 ", fg="white", bg="black",
    font=("",12), command=(lambda *args: set_command_value(0)),
    )
m_cb1 = tkinter.Button(Cwin,
    text = " 1 ", fg="white", bg="black",
    font=("",12), command=(lambda *args: set_command_value(1)),
    )
m_cb2 = tkinter.Button(Cwin,
    text = " 2 ", fg="white", bg="black",
    font=("",12), command=(lambda *args: set_command_value(2)),
    )
m_cb3 = tkinter.Button(Cwin,
    text = " 3 ", fg="white", bg="black",
    font=("",12), command=(lambda *args: set_command_value(3)),
    )
m_cb4 = tkinter.Button(Cwin,
    text = " 4 ", fg="white", bg="black",
    font=("",12), command=(lambda *args: set_command_value(4)),
    )
m_cb5 = tkinter.Button(Cwin,
    text = " 5 ", fg="white", bg="black",
    font=("",12), command=(lambda *args: set_command_value(5)),
    )
m_cb6 = tkinter.Button(Cwin,
    text = " 6 ", fg="white", bg="black",
    font=("",12), command=(lambda *args: set_command_value(6)),
    )
m_cb7 = tkinter.Button(Cwin,
    text = " 7 ", fg="white", bg="black",
    font=("",12), command=(lambda *args: set_command_value(7)),
    )
m_cb8 = tkinter.Button(Cwin,
    text = " 8 ", fg="white", bg="black",
    font=("",12), command=(lambda *args: set_command_value(8)),
    )
m_cb9 = tkinter.Button(Cwin,
    text = " 9 ", fg="white", bg="black",
    font=("",12), command=(lambda *args: set_command_value(9)),
    )

m_cb0.place(x=70, y=365, width=60, height=50)

m_cb1.place(x=5, y=310, width=60, height=50)
m_cb2.place(x=70, y=310, width=60, height=50)
m_cb3.place(x=135, y=310, width=60, height=50)

m_cb4.place(x=5, y=255, width=60, height=50)
m_cb5.place(x=70, y=255, width=60, height=50)
m_cb6.place(x=135, y=255, width=60, height=50)

m_cb7.place(x=5, y=200, width=60, height=50)
m_cb8.place(x=70, y=200, width=60, height=50)
m_cb9.place(x=135, y=200, width=60, height=50)


ob_pl = tkinter.Button(Cwin,
    text = " + ", fg="white", bg="black",
    font=("",12), command=(lambda *args: set_command_operator('+')),
    )
ob_mi = tkinter.Button(Cwin,
    text = " - ", fg="white", bg="black",
    font=("",12), command=(lambda *args: set_command_operator('-')),
    )
ob_ml = tkinter.Button(Cwin,
    text = " × ", fg="white", bg="black",
    font=("",12), command=(lambda *args: set_command_operator('*')),
    )
ob_di = tkinter.Button(Cwin,
    text = " ÷ ", fg="white", bg="black",
    font=("",12), command=(lambda *args: set_command_operator('/')),
    )

ob_pa_l = tkinter.Button(Cwin,
    text = " ( ", fg="white", bg="black",
    font=("",12), command=(lambda *args: set_command_operator('(')),
    )
ob_pa_r = tkinter.Button(Cwin,
    text = " ) ", fg="white", bg="black",
    font=("",12), command=(lambda *args: set_command_operator(')')),
    )
ob_bl = tkinter.Button(Cwin,
    text = " . ", fg="white", bg="black",
    font=("",12), command=(lambda *args: set_command_operator('.')),
    )

ob_re = tkinter.Button(Cwin,
    text = " = ", fg="white", bg="black",
    font=("",12), command=result,
    )
ob_cl = tkinter.Button(Cwin,
    text = " C ", fg="white", bg="black",
    font=("",12), command=clear,
    )
ob_bs = tkinter.Button(Cwin,
    text = " <= ", fg="white", bg="black",
    font=("",12), command=backspace,
    )

ob_pl.place(x=200, y=365, width=60, height=50)
ob_mi.place(x=200, y=310, width=60, height=50)
ob_ml.place(x=200, y=255, width=60, height=50)
ob_di.place(x=200, y=200, width=60, height=50)

ob_pa_l.place(x=5, y=145, width=60, height=50)
ob_pa_r.place(x=70, y=145, width=60, height=50)
ob_bl.place(x=5, y=365, width=60, height=50)

ob_cl.place(x=135, y=145, width=60, height=50)
ob_bs.place(x=200, y=145, width=60, height=50)
ob_re.place(x=135, y=365, width=60, height=50)


Cwin.mainloop()
