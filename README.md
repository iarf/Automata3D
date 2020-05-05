# Automata3D
Visualization tool for 3-dimensional cellular automata. Uses Three.js

Live demo available at http://ianflom.com/projects/automata3d/

## Introduction and Core Concepts
This project serves to show outcomes of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) when interpolated to a 3-dimensional space. It also uses a fairly straightforward standard to ruleset notation, allowing the user to explore rulesets beyond the traditional 2 dimensional guidelines laid out by Conway.

## Ruleset Notation
The ruleset notation used here is an attempt at standardizing definitions of rules for "Life-like" cellular automata. A ruleset could be expressed as &lt Ruleset Name &gt \[E<sub>1</sub>E<sub>2</sub>F<sub>1</sub>F<sub>2</sub>\]. Example: Von Neumann\[2,3,3,3\].

### Neighborhood Types
A neighborhood describes which group of cells qualify cell's neighbors.

At present, the neighborhood options are:
- Moore: Traditional Game of Life neighborhood style, consists of all cells at range (1). This includes corner and edge adjacencies. A cell's Moore neighborhood consists of 26 cells, excluding the cell itself.
- Von Neumann: All cells adjacent to faces. A cell's Von Neumann neighborhood consists of 6 cells, excluding the cell itself.

### Numeric Notation
The numeric notation used to describe rulesets here is derived from [*Candidates for the Game of Life in Three Dimensions*](https://wpmedia.wolfram.com/uploads/sites/13/2018/02/01-3-1.pdf) (Carter Bays, 1987).
The notation consists of 4 numeric values, defined as follows:

- E<sub>1</sub>: Minimum number of neighbors for a living cell to remain alive.
- E<sub>2</sub>: Maximum number of neighbors for a living cell to remain alive.
- F<sub>1</sub>: Minimum number of neighbors a non-living cell can have to become living in the next generation.
- F<sub>2</sub>: Maximum number of neighbors a non-living cell can have to become living in the next generation.

## Usage

1. Input your desired ruleset, choosing from the neighborhood dropdown and inputting integers into the E- and F- values. (Note: the ruleset can be changed at any time when the simulation is stopped).
2. Choose the size of the cube. Note that for performance reasons, above 70<sup>3<sup> is not recommended here.
3. Choose an interval to wait between generations, in miliseconds.
4. Click "Initialize" to instantiate the game space.
5. Use the 2 dimensional grid interface and level selector to set initially active cells. These will update visually in the three dimensional model as they are added.
6. Click "Start" to run the simulation.