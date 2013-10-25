<!DOCTYPE html>
<html>
<head>
<link href="css/bootstrap.min.css" rel="stylesheet" media="screen">
<style>
.cam {
	height: 500px;
	background: #ddd;
}
</style>
</head>
<body>
	<div class="container">
		<div class="top row">
			<div class="cam span8"></div>
			<div class="span4">
				<h4>Voice commands</h4>
				<ul>
					<li><strong>Grow</strong> up/down/left/right/x/y/all</li>
						Make the sleeve larger in one or more directions
					<li><strong>Shrink</strong> up/down/left/right/x/y/all</li>
						Make the sleeve smaller in one or more directions
					<li><strong>Move</strong> up/down/left/right</li>
						Move the sleeve in the X/Y plane
					<li><strong>Stop</strong></li>
						Stop the current command
				</ul>
			</div>
		</div>
		<div class="bottom row">
			<div class="mode span4">
				<h4>Mode</h4>
				<div class="select btn btn btn-success">Select</div>
				<div class="grab btn btn btn-danger">Grab</div>
			</div>
			<div class="record span4">
				<h4>Recording</h4>
				<input type="text" class="result input-block" />
				<br />
				<div class="start btn btn btn-success"><i class="icon-play"></i>Start</div>
				<div class="stop btn btn btn-danger"><i class="icon-stop"></i>Stop</div>
				<div class="clear btn btn-primary">Clear</div>
			</div>
			<div class="sleeve span4">
				<h4>Sleeve</h4>
				<div class="cube btn btn btn-success">Cube</div>
				<div class="sphere btn btn btn-danger">Sphere</div>
				<div class="cylinder btn btn btn-danger">Cylinder</div>
			</div>
		</div>
	</div>

<!-- Libraries -->
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script type="text/javascript" src="js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/backbone-min.js"></script>
<script type="text/javascript" src="js/three.min.js"></script>
<!-- My code -->
<script type="text/javascript" src="js/controller.js"></script>
</body>
</html>