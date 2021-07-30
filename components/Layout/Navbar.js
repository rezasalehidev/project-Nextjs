import React from "react";
import { Menu, Container, Icon } from "semantic-ui-react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button,Segment } from 'semantic-ui-react'

function Navbar() {
  const router = useRouter();

  const isActive = route => router.pathname === route;

  return (
    <Menu fluid borderless>
        <Container text>
  <Button.Group>
      <Button primary>
        <Link href="/login">
            <span className='login'>Login</span>
          </Link>
        </Button>
      <Button.Or />
      <Button positive color='teal'>
        <Link href="/signup">
            <span className='signup'>Signup</span>
        </Link></Button>
    </Button.Group>
    
        
      </Container>
    </Menu>
  );
}

export default Navbar;
