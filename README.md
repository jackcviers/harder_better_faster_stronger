harder_better_faster_stronger
=============================

Visualizing music with Backbone js


This repository contains the slides (under presentation/) and the code for a presentation for visualizing music with Backbone.js.

Any notes on giving this presentation will be stored under notes/.

The presentation is broken into four parts:

harder
------

Describes motivation for mvc. Overviews what happens with spaghetti code for an application. Shows starting point and goal.

better
-------

Describes mvc pattern as implemented by Backbone.js Introduces the four main components of Backbone - *Model*, *View*, *Controller*, *Router*.

faster
-------

Describes using a model and a view to load a file and show the progress loading the file, storing it into a choice of server or local storage.
Shows retrieving same file in a collection and visualizing various files in the storage in a view. Essentially crud and DAO 
patterns.

stronger
---------

Shows how to use models and views to display data via apis other than ajax -- mainly, music data streamed through the audio api.
Describes how the previous music list view can be used in combination with an audio player to load and play a file. Shows how a router
can manage a history of played files in a SPA. We can show how views can mangage different visualization mediums, including html
and canvas based views -- finishing up with a view that processes audio data and produces a visualization along with the music.

To avoid copyright infringement, I am providing my own legally obtained music files for this presentation, and if you use the
same presentation you should provide your own. I suggest Daft Punk, but Kanye West is applicable too. I'm hardcoding the app to crash
when Brittany Spears is played. There is some accounting for taste.
