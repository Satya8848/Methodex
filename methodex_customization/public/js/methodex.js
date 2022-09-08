frappe.ui.form.on('CRM Tasks', {
	address_query: function(frm, link_doctype, link_name) {
		return {
			query: 'frappe.contacts.doctype.address.address.address_query',
			filters: {
				link_doctype: link_doctype,
				link_name: link_name,
			}
		};
	},
	contact_query: function(frm, link_doctype, link_name) {
		return {
			query: 'frappe.contacts.doctype.contact.contact.contact_query',
			filters: {
				link_doctype: link_doctype,
				link_name: link_name
			}
		};
	},
	onload: function(frm) {
	   if(frm.doc.customer !== ""){
    		frm.set_query("customer_address", () => {
    			return frm.events.address_query(frm, "Customer", frm.doc.customer);
    		});
    		frm.set_query("contact", () => {
    			return frm.events.contact_query(frm, "Customer", frm.doc.customer);
    		});
	    }else{
	        frm.set_value("contact","");
	        frm.set_value("contact_display","");
	        frm.set_value("customer_address","");
	        frm.set_value("address_display","");
	    }
	},
	customer: function(frm) {
		if (frm.doc.customer) {
			frm.events.set_address_name(frm, 'Customer', frm.doc.customer);
			frm.events.set_contact_name(frm, 'Customer', frm.doc.customer);
		}
		else{
		    frm.set_value("customer_address","");
		    frm.set_value("address_display","");
		    frm.set_value("contact","");
		    frm.set_value("contact_display","");
		}
	},
	set_address_name: function(frm, ref_doctype, ref_docname) {
		frappe.call({
			method: "methodex_customization.methodex.methodex.get_address_name",
			args: {
				ref_doctype: ref_doctype,
				docname: ref_docname
			},
			callback: function(r) {
				if (r.message) {
                    frm.set_value('customer_address', r.message);
				}
			}
		});
	},
	set_contact_name: function(frm, ref_doctype, ref_docname) {
		frappe.call({
			method: "methodex_customization.methodex.methodex.get_contact_name",
			args: {
				ref_doctype: ref_doctype,
				docname: ref_docname
			},
			callback: function(r) {
				if (r.message) {
					frm.set_value('contact', r.message);
				}
			}
		});
	},
	customer_address: function(frm) {
	    if(frm.doc.customer_address){
		    erpnext.utils.get_address_display(frm, 'customer_address', 'address_display', false);
	    }
	},
	contact: function(frm) {
		if (frm.doc.contact) {
			frm.events.get_contact_display(frm, frm.doc.contact);
		}
	},
	get_contact_display: function(frm, contact_name) {
		frappe.call({
			method: "frappe.contacts.doctype.contact.contact.get_contact_details",
			args: { contact: contact_name },
			callback: function(r) {
    			    if(r.message){
    			        let contact_display = r.message.contact_display;
    					if (r.message.contact_email) {
    						contact_display += '<br>' + r.message.contact_email;
    					}
    					if (r.message.contact_phone) {
    						contact_display += '<br>' + r.message.contact_phone;
    					}
    					if (r.message.contact_mobile && !r.message.contact_phone) {
    						contact_display += '<br>' + r.message.contact_mobile;
    					}
    					frm.set_value('contact_display', contact_display);
    			    }else{
    			        frm.set_value('contact_display', "");
    			    }
					
			    }
		   });
	},
});