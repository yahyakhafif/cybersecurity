**what is wrong:** Absence of Anti-CSRF Tokens     

**How did you find it?** using zap attack     

**How should it work/What should be fixed?** Adding Anti-CSRF Tokens in the HTML file of the following files: reservation.html, login.html, register.html, resource.html.      


**what is wrong:** Format String Error in resources endpoint    

**How did you find it?** Using zap attack     

**How should it work/What should be fixed?** Rewrite the background program using proper deletion of bad character strings.    


**what is wrong:** Cross Site Scripting Weakness (Persistent in JSON Response) in resourcesList endpoint.    

**How did you find it?** Using zap attack     

**How should it work/What should be fixed?** Use a vetted library or framework that does not allow this weakness to occur or provides constructs that make this weakness easier to avoid.    


**what is wrong:** resources chart bug showing only booked resources without showing any of the upper part of the page.    

**How did you find it?** After using the zap attack too many resources were booked which revealed this problem     

**How should it work/What should be fixed?** it should allow users to scroll through the booked resources and leave the upper page content in a fixed position. 


**what is wrong:** reserver can also add resources and reservations.    

**How did you find it?** manual testing.     

**How should it work/What should be fixed?** only the administator should be allowed to add resources. 
