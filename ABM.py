from numpy import False_
import pgzrun
import pygame
import time
import random
class Cell:
    t_now = 0
    t_next = 1

    @staticmethod
    def update():
        Cell.t_now, Cell.t_next = Cell.t_next, Cell.t_now

    def __init__(self,x_pos,y_pos,states,values):
        self.neighbours = []
        self.x_pos = x_pos
        self.y_pos = y_pos
        self.occupants = [None,None]
        self.number_neighbours =0
        self.states=[{},{}]
        for s in range(len(states)):
            if values[s]=="rnd":
                v = random.random()
                self.states[0][states[s]]= v
                self.states[1][states[s]]= v
            else:
                self.states[0][states[s]]=values[s]
                self.states[1][states[s]]=values[s]

    def setState(self,state,value):
        self.states[Cell.t_next][state]=value

    def getState(self,state):
        return self.states[Cell.t_now][state]

    def isState(self,state,value):
        return self.states[Cell.t_now][state]==value

    
    def preDiffuse(self,state):
        self.states[Cell.t_next][state]=0

    def diffuse(self,state,fraction):
        amount = self.states[Cell.t_now][state]
        self.states[Cell.t_next][state]+= self.states[Cell.t_now][state]-amount
        t_amount = amount
        amount = amount/self.number_neighbours
        for cell in self.neighbours:
            cell.states[Cell.t_next][state]+=amount
            t_amount-=amount
        self.states[Cell.t_next][state]+=t_amount



    def addNeighbour(self,cell):
      self.neighbours.append(cell)
      self.number_neighbours+=1



    def addOccupant(self,occupant):
      self.occupants[Cell.t_now]=occupant
      self.occupants[Cell.t_next]=occupant

    def count(self,state,value):
        count = 0
        for cell in self.neighbours:
            if cell.states[Cell.t_now][state]==value:
                count+=1
        return count

class World:
    frame = 0.01
    def __init__(self,size,states,values):
        self.size = size
        self.cells=[]
        for i in range(self.size*self.size):
            self.cells.append(Cell((i%self.size),int(i/self.size),states,values))
        for cell in self.cells:
            for  y in range(cell.y_pos-1,cell.y_pos+2):
                for  x in range(cell.x_pos-1,cell.x_pos+2):
                    x=self.bounds(x)
                    y=self.bounds(y)
                    if (cell.x_pos!=x) or (cell.y_pos!=y):
                        pos = y*self.size+x
                        cell.addNeighbour(self.cells[pos])

    def setCell(self,x,y,state,value):
        pos = y*self.size+x
        self.cells[pos].setState(state,value)

    def getCell(self,x,y):
        pos = y*self.size+x
        return self.cells[pos]

    def countAll(self,state,value):
        count=0
        for cell in self.cells:
            if cell.isState(state,value):
                count+=1
        return count

    def diffuse(self,state,value):
        for cell in self.cells:
            cell.preDiffuse(state)
        for cell in self.cells:
            cell.diffuse(state,value)

    def update(self):
        Cell.update()

    def bounds(self,i):
        if i<0:
            return self.size + i
        if i>=self.size:
            return i-self.size
        return i

def go():
    pgzrun.go()
def draw(screen,world,state,value,discreet=False_):
    pygame.display.set_caption('ABM')
    time.sleep(World.frame)
    width = screen.surface.get_width()
    height = screen.surface.get_height()
    ratio = width/world.size
    box_size = int(ratio-1)

    screen.fill((60, 60, 80))
    for cell in world.cells:
        x_pos = int(cell.x_pos*ratio)
        y_pos = int(cell.y_pos*ratio)
        box = pygame.Rect((x_pos,y_pos),(box_size,box_size))
        if discreet:
            if cell.isState(state,value):
                screen.draw.filled_rect(box,(60,200,60))
        else:
            amount = cell.getState(state)
            r = int(255*(amount/value))
            if r>255:
                r=255
            if r<0:
                r=0
            screen.draw.filled_rect(box,(r,0,0))