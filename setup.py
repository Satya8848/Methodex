from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in methodex_customization/__init__.py
from methodex_customization import __version__ as version

setup(
	name="methodex_customization",
	version=version,
	description="Methodex Customization",
	author="Satya",
	author_email="satya@8848digital.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
