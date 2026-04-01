import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';
import { register } from '../../src/api/client';
import { setToken } from '../../src/api/authStorage';

export default function SignupScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await register(name.trim(), email.trim(), password);
      // Backend returns data: { token, ... }
      await setToken(res.data.token);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>Sign up to start discovering nightlife events</Text>
        </View>

        <View style={styles.form}>
          <View style={[styles.inputWrap, { backgroundColor: colors.background.secondary, borderColor: colors.border.subtle }]}>
            <Ionicons name="person-outline" size={18} color={colors.text.tertiary} />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Full Name"
              placeholderTextColor={colors.text.tertiary}
              style={[styles.input, { color: colors.text.primary }]}
            />
          </View>

          <View style={[styles.inputWrap, { backgroundColor: colors.background.secondary, borderColor: colors.border.subtle }]}>
            <Ionicons name="mail-outline" size={18} color={colors.text.tertiary} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={colors.text.tertiary}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[styles.input, { color: colors.text.primary }]}
            />
          </View>

          <View style={[styles.inputWrap, { backgroundColor: colors.background.secondary, borderColor: colors.border.subtle }]}>
            <Ionicons name="lock-closed-outline" size={18} color={colors.text.tertiary} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor={colors.text.tertiary}
              secureTextEntry
              style={[styles.input, { color: colors.text.primary }]}
            />
          </View>

          <View style={[styles.inputWrap, { backgroundColor: colors.background.secondary, borderColor: colors.border.subtle }]}>
            <Ionicons name="lock-closed-outline" size={18} color={colors.text.tertiary} />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              placeholderTextColor={colors.text.tertiary}
              secureTextEntry
              style={[styles.input, { color: colors.text.primary }]}
            />
          </View>

          {error && (
            <Text style={[styles.error, { color: colors.status.error }]}>{error}</Text>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.neon.pink }]}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={[styles.buttonText, { color: colors.text.primary }]}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text.secondary }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={[styles.linkText, { color: colors.neon.blue }]}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    paddingVertical: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    height: 54,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  button: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  error: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});