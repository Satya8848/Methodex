import frappe


@frappe.whitelist()
def get_address_name(ref_doctype, docname):
	# Return address name
	return get_party_address(ref_doctype, docname)

def get_party_address(doctype, name):
	out = frappe.db.sql(
		"SELECT dl.parent "
		"from `tabDynamic Link` dl join `tabAddress` ta on dl.parent=ta.name "
		"where "
		"dl.link_doctype=%s "
		"and dl.link_name=%s "
		"and dl.parenttype='Address' "
		"and ifnull(ta.disabled, 0) = 0 "
		"limit 1",
		(doctype, name),
	)
	if out:
		return out[0][0]
	else:
		return ""

@frappe.whitelist()
def get_contact_name(ref_doctype, docname):
	# Return Contact name
	return get_default_contact(ref_doctype, docname)


def get_default_contact(doctype, name):
	out = frappe.db.sql(
		"""
			SELECT dl.parent, c.is_primary_contact, c.is_billing_contact
			FROM `tabDynamic Link` dl
			INNER JOIN `tabContact` c ON c.name = dl.parent
			WHERE
				dl.link_doctype=%s AND
				dl.link_name=%s AND
				dl.parenttype = 'Contact'
		""",
		(doctype, name),
	)
	if out:
		try:
			return out[0][0]
		except Exception:
			return None
	else:
		return None