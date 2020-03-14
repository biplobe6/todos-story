import os
import sys
import subprocess
from argparse import ArgumentParser


VERSION = "v1.0.4"

# /app/repo/backend/
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
BACKEND_DIR = BASE_DIR

# /app/repo/
REPO_DIR = os.path.abspath(os.path.join(BASE_DIR, '..'))

# /app/repo/client
CLIENT_DIR = os.path.abspath(os.path.join(REPO_DIR, 'client'))



def cmd(command):
	return subprocess.call(command, shell=True)


def active_cmd(command):
	return cmd((
		'. {backend}/venv/bin/activate;' +
		command
	).format(
		backend=BACKEND_DIR,
	))


def clean_env():
	cmd(
		'echo "Cleaning \'venv\'.";'
		'rm -rf {backend}/venv'.format(
		backend=BACKEND_DIR
	))


def create_env():
	cmd((
		'echo Installing...;' +
		'cd {backend};' +
		'python3 -m venv venv;'
	).format(
		backend=BACKEND_DIR
	))


def update_pip():
	active_cmd(
		'python -m pip install pip -U'
	)

def install_requirements():
	active_cmd(
		'cd {};'.format(BACKEND_DIR) +
		'pip install -r requirements.txt'
	)

def migrate_app():
	active_cmd(
		'cd {};'.format(BACKEND_DIR) +
		'python manage.py migrate'
	)

def update_dist():
	cmd(
		'rm -rf client/dist;' +
		'cp -r backend/static_files client/dist;' +
		'echo "Updated static/dist files.";'
	)

def clean_static_files():
	cmd(
		'rm -rf {}/static_files'.format(BACKEND_DIR)
	)
	print('Static files cleaned.')

def yarn_build():
	cmd(
		'cd {};'.format(CLIENT_DIR) +
		'rm -rf dist;' +
		'yarn build'
	)

def collect_static():
	active_cmd(
		'cd {};'.format(BACKEND_DIR) +
		'python manage.py collectstatic --noinput ' +
		'-i rest_framework -i django_extensions'
	)



def action_installer(args):
	if args.clean:
		clean_env()
		create_env()
		update_pip()
	install_requirements()
	migrate_app()
	update_dist()



def action_static_files(args):
	if args.clean:
		clean_static_files()
	if args.build:
		yarn_build()
		collect_static()
	update_dist()


def action_start_app(args):
	if args.fresh_dist:
		update_dist()
	try:
		active_cmd(
			'cd {};'.format(BACKEND_DIR) +
			'celery worker -A main -l info -B &' +
			'python manage.py runserver {}'.format(args.port)
		)
	except KeyboardInterrupt:
		pass



def action_default(args):
	if args.version:
		print(VERSION)


if __name__ == "__main__":
	parser = ArgumentParser()
	parser.add_argument('--version', '-v', help='App version', action="store_true")
	sub_parser = parser.add_subparsers(help="Command")

	# ==================================[ INSTALL ]===================================
	install_parser = sub_parser.add_parser('install')
	install_parser.add_argument('--clean', help="Clean Installation.", action="store_true")
	install_parser.set_defaults(func=action_installer)


	# ===================================[ STATIC ]===================================
	static_parser = sub_parser.add_parser('static')
	static_parser.add_argument('--build', '-b', help="Build Frontend.", action="store_true")
	static_parser.add_argument('--clean', '-c', help="Clean build.", action="store_true")
	static_parser.set_defaults(func=action_static_files)


	# ===================================[ START ]====================================
	start_parser = sub_parser.add_parser('start')
	start_parser.add_argument('--port', '-p', help="Port Number", type=int, default=8282)
	start_parser.add_argument('--fresh-dist', '-s', help="Start with fresh dist files.", action="store_true")
	start_parser.set_defaults(func=action_start_app)


	args = parser.parse_args()
	if hasattr(args, 'func'):
		args.func(args)
	else:
		action_default(args)


