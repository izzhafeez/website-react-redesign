use regex::Regex;
use serde::Serialize;
use std::collections::HashMap;
use std::fs;
use std::f32::consts::PI;

type Coord = (f32, f32);

#[derive(Serialize, Debug)]
struct RouteInfo {
	route: Vec<Coord>,
	length: f32
}

fn main() {
	let dir = "../../src/data/blog/hikes/kml";
	let paths = get_paths(dir);
	let map = get_json_from_path(paths);
	let json = serde_json::to_string_pretty(&map).unwrap();
	std::fs::write("../../src/data/blog/hikes/processed.json", json.as_bytes())
		.expect("Couldn't write to file.");
}

fn get_paths(dir: &str) -> Vec<std::path::PathBuf> {
	fs::read_dir(dir)
		.unwrap()
		.into_iter()
		.map(|path|	path.unwrap().path())
		.collect()
}

fn get_json_from_path(paths: Vec<std::path::PathBuf>) -> HashMap<String, RouteInfo> {
	paths.into_iter()
		.map(|path| {
			let key = get_key_from_path(&path);
			let route = parse_kml(read_file(path));
			let route_length = get_length_of_route(&route);
			let route_info = RouteInfo { route: route, length: route_length };
			(key, route_info)
		})
		.collect()
}

fn get_key_from_path(path: &std::path::PathBuf) -> String {
	path.to_str()
		.unwrap()
		.replace(".kml", "")
		.split("/")
		.last()
		.unwrap()
		.to_string()
}

fn get_distance_between_points(p1: Coord, p2: Coord) -> f32 {
	let r = 6371.14;
	let ph1 = p1.1 * PI / 180.0;
	let ph2 = p2.1 * PI / 180.0;
	let dp = (p2.1 - p1.1) * PI / 180.0;
	let dl = (p2.0 - p1.0) * PI / 180.0;
	let a: f32 = (dp/2.0).sin().powf(2.0)
		+ (ph1.cos() * ph2.cos() * (dl/2.0).sin().powf(2.0));
	let c: f32 = 2.0 * a.powf(0.5).atan2((1.0 - a).powf(0.5));
	r * c
}

fn get_length_of_route(route: &Vec<Coord>) -> f32 {
	route.windows(2)
		.map(|w| get_distance_between_points(w[0], w[1]))
		.sum()
}

fn read_file(path: std::path::PathBuf) -> String {
	fs::read_to_string(path).expect("Unable to read file")
}

fn parse_kml(kml: String) -> Vec<Coord> {
	let re = Regex::new(r"(-?\d+\.\d+),(-?\d+\.\d+),(-?\d+)").unwrap();
	let route: Vec<Coord> = re.captures_iter(&kml)
		.map(|c| {
			let lng: f32 = c.get(1).unwrap().as_str().parse().unwrap();
			let lat: f32 = c.get(2).unwrap().as_str().parse().unwrap();
			(lng, lat)
		})
		.collect();
	route[0..=route.len()-3].to_vec()
}